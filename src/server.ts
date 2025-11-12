import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

// Serve static files from public (compiled into dist/public)
app.use(express.static(path.join(__dirname, 'public')));

// Interface for lead data
interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  propertyType?: string;
  budget?: string;
  message?: string;
}

// Simple API endpoint to capture lead data
app.post('/api/lead', async (req: Request, res: Response) => {
  const leadData = req.body as LeadData;

  // Validate required fields
  if (!leadData.name || !leadData.email || !leadData.phone || !leadData.city || !leadData.state) {
    return res.status(400).json({
      ok: false,
      message: 'Please fill in all required fields'
    });
  }

  // Log the lead data
  console.log('Lead received:', {
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    city: leadData.city,
    state: leadData.state,
    propertyType: leadData.propertyType || 'Not specified',
    budget: leadData.budget || 'Not specified',
    message: leadData.message || 'No additional message'
  });

  // Send to webhook
  try {
    const webhookResponse = await fetch('https://stage.aivi.io/webhook/ffa99552-ec80-43ff-89cd-91f79d697359', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    if (!webhookResponse.ok) {
      console.error('Webhook request failed:', webhookResponse.status, webhookResponse.statusText);
    } else {
      console.log('Webhook sent successfully');
    }
  } catch (webhookError) {
    console.error('Error sending webhook:', webhookError);
    // Continue even if webhook fails - don't fail the user's request
  }

  // In a real app you'd persist this to a database or CRM.
  res.json({
    ok: true,
    message: 'Thank you! Your information has been received successfully.'
  });
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
