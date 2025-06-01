import { app, InvocationContext } from "@azure/functions";
import nodemailer from "nodemailer";

export async function ProcessNewsletter(queueItem: any, context: InvocationContext): Promise<void> {
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "maddison53@ethereal.email",
            pass: "jn7jnAPss4f63QBp6D",
        },
    });

    context.log("Service Bus queue message received:", queueItem, typeof queueItem);

    const emailData = typeof queueItem === "string" ? JSON.parse(queueItem) : queueItem;

    context.log(`Sending newsletter to: ${emailData.email}`);
    context.log(`Subject: ${emailData.subject}`);
    context.log(`Content: ${emailData.content}`);

    // You can add actual email-sending logic here
}

app.serviceBusQueue("ProcessNewsletter", {
    queueName: "newsletter-queue",               // replace with your queue name
    connection: "ServiceBusConnection",          // this must match the setting name in Azure
    handler: ProcessNewsletter
});
