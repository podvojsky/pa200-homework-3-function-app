import { app, InvocationContext } from "@azure/functions";
import * as nodemailer from "nodemailer";

const MAILTRAP_HOST = process.env.MAILTRAP_HOST;
const MAILTRAP_PORT = Number(process.env.MAILTRAP_PORT || "2525");
const MAILTRAP_USER = process.env.MAILTRAP_USER;
const MAILTRAP_PASS = process.env.MAILTRAP_PASS;

if (!MAILTRAP_USER || !MAILTRAP_PASS) {
    throw new Error("Mailtrap credentials are not set in environment variables.");
}

const transporter = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    auth: {
        user: MAILTRAP_USER,
        pass: MAILTRAP_PASS
    }
});

export async function ProcessNewsletter(queueItem: any, context: InvocationContext): Promise<void> {
    context.log("Service Bus queue message received:", queueItem);

    try {
        const emailData = typeof queueItem === "string" ? JSON.parse(queueItem) : queueItem;
        context.log(`Sending newsletter to: ${emailData.email}`);

        const info = await transporter.sendMail({
            from: 'PA200 - HW3 - Newsletter <newsletter@example.com>',
            to: emailData.email,
            subject: "test",
            text: emailData.message,
            html: `<p>${emailData.message}</p>`
        });

        context.log("✅ Email sent:", info.messageId);
    } catch (err: any) {
        context.log("❌ Error sending email:", err);
        throw err;
    }
}

app.serviceBusQueue("ProcessNewsletter", {
    queueName: "newsletter-queue",
    connection: "ServiceBusConnection",
    handler: ProcessNewsletter
});
