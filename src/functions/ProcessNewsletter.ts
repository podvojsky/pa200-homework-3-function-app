import { app, InvocationContext } from "@azure/functions";
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
if (!SENDGRID_API_KEY) {
    throw new Error("SendGrid API key not set in environment variables.");
}

sgMail.setApiKey(SENDGRID_API_KEY);

export async function ProcessNewsletter(queueItem: any, context: InvocationContext): Promise<void> {
    context.log("Service Bus queue message received:", queueItem, typeof queueItem);

    try {
        const emailData = typeof queueItem === "string" ? JSON.parse(queueItem) : queueItem;
        context.log(`Sending newsletter to: ${emailData.email}`);
        context.log(`Subject: ${emailData.subject}`);
        context.log(`Content: ${emailData.content}`);

        const msg = {
            to: emailData.email,
            from: "test@example.com", // Must be verified in SendGrid
            subject: emailData.subject,
            text: emailData.content,
            html: `<p>${emailData.content}</p>`,
        };

        await sgMail.send(msg);

        context.log(`✅ Newsletter sent successfully to: ${emailData.email}`);

    } catch (error: any) {
        context.log("❌ Failed to send newsletter:", error);
        throw error;  // So Azure Functions knows there was a failure
    }
}

app.serviceBusQueue("ProcessNewsletter", {
    queueName: "newsletter-queue",               // your queue name
    connection: "ServiceBusConnection",          // your connection string setting name
    handler: ProcessNewsletter
});
