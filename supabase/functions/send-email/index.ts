
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
}

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-EMAIL] ${step}${detailsStr}`);
};

const getEmailTemplate = (template: string, data: Record<string, any> = {}) => {
  const templates = {
    welcome: `
      <h1>Welcome to AloraMed, ${data.name || 'User'}!</h1>
      <p>Thank you for joining our healthcare management platform.</p>
      <p>You can now access all features of your account.</p>
      <p>Best regards,<br>The AloraMed Team</p>
    `,
    subscription_activated: `
      <h1>Subscription Activated!</h1>
      <p>Hi ${data.name || 'User'},</p>
      <p>Your ${data.plan || 'Premium'} subscription has been successfully activated.</p>
      <p>You now have access to all premium features.</p>
      <p>Best regards,<br>The AloraMed Team</p>
    `,
    password_reset: `
      <h1>Password Reset Request</h1>
      <p>Hi ${data.name || 'User'},</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${data.resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The AloraMed Team</p>
    `,
    appointment_reminder: `
      <h1>Appointment Reminder</h1>
      <p>Hi ${data.patientName || 'Patient'},</p>
      <p>This is a reminder about your upcoming appointment:</p>
      <ul>
        <li><strong>Date:</strong> ${data.appointmentDate}</li>
        <li><strong>Time:</strong> ${data.appointmentTime}</li>
        <li><strong>Doctor:</strong> ${data.doctorName}</li>
      </ul>
      <p>Please arrive 15 minutes early.</p>
      <p>Best regards,<br>The AloraMed Team</p>
    `
  };
  
  return templates[template as keyof typeof templates] || templates.welcome;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const emailProvider = Deno.env.get("EMAIL_PROVIDER") || "smtp";
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Deno.env.get("SMTP_PORT") || "587";
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpHost || !smtpUser || !smtpPassword) {
      throw new Error("SMTP configuration not complete");
    }

    const { to, subject, template, data = {} }: EmailRequest = await req.json();
    
    if (!to || !subject || !template) {
      throw new Error("Missing required fields: to, subject, template");
    }

    logStep("Preparing email", { to, subject, template });

    const htmlContent = getEmailTemplate(template, data);

    // For now, we'll use a simple SMTP approach
    // In production, you might want to use a service like SendGrid, Mailgun, etc.
    const emailData = {
      from: smtpUser,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    // Simulate email sending (replace with actual SMTP implementation)
    logStep("Email would be sent", emailData);

    // You can integrate with actual email services here
    // For example: SendGrid, Mailgun, AWS SES, etc.

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in send-email", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
