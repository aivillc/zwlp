document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('leadForm');
  if (!form) return;

  // Add smooth scroll to logo
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Add input animation effects
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });

  // Form submission
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = new FormData(form);

    const payload = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      phone: data.get('phone'),
      city: data.get('city'),
      state: data.get('state'),
      propertyType: data.get('propertyType'),
      budget: data.get('budget'),
      message: data.get('message')
    };

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.textContent : '';
    if (btn) {
      btn.setAttribute('disabled', 'true');
      btn.textContent = 'Submitting...';
    }

    try {
      // Submit to API (server will handle webhook)
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json();

      if (res.ok) {
        // Show success message
        showNotification('Thank you! Your information has been received. We\'ll contact you soon.', 'success');
        form.reset();
      } else {
        showNotification(body.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      showNotification('There was an error submitting the form. Please try again.', 'error');
      console.error('Form submission error:', err);
    } finally {
      if (btn) {
        btn.removeAttribute('disabled');
        btn.textContent = originalText;
      }
    }
  });

  // Custom notification function
  function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const styles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '12px',
      backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      fontSize: '15px',
      fontWeight: '600',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      zIndex: '1000',
      animation: 'slideInRight 0.3s ease',
      maxWidth: '400px'
    };

    Object.assign(notification.style, styles);
    document.body.appendChild(notification);

    // Add animation keyframe
    if (!document.querySelector('#notificationStyles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'notificationStyles';
      styleSheet.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Chat Widget Functionality
  const chatButton = document.getElementById('chatButton');
  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  // Toggle chat window
  if (chatButton && chatWindow) {
    chatButton.addEventListener('click', () => {
      chatButton.classList.toggle('active');
      chatWindow.classList.toggle('active');
      if (chatWindow.classList.contains('active')) {
        chatInput.focus();
      }
    });
  }

  // Auto-responses for demo purposes
  const autoResponses = [
    "Thanks for reaching out! Our team will get back to you shortly.",
    "That's a great question! Let me connect you with one of our real estate experts.",
    "We'd love to help you find your dream home. Can you tell me more about what you're looking for?",
    "I can definitely help with that. What's your preferred location?",
    "Great! Our agents typically respond within a few minutes. Is there anything else I can help with?"
  ];

  // Send message function
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerHTML = `<div class="message-content">${escapeHtml(message)}</div>`;
    chatMessages.appendChild(userMessageDiv);

    // Clear input
    chatInput.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      const botMessageDiv = document.createElement('div');
      botMessageDiv.className = 'message bot-message';
      botMessageDiv.innerHTML = `<div class="message-content">${botResponse}</div>`;
      chatMessages.appendChild(botMessageDiv);

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 800);
  }

  // Helper function to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Send button click
  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
  }

  // Enter key to send
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});
