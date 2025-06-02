import { app, InvocationContext } from "@azure/functions";
import * as nodemailer from "nodemailer";

const MAIL_SERVICE_HOST = process.env.MAIL_SERVICE_HOST;
const MAIL_SERVICE_PORT = Number(process.env.MAIL_SERVICE_PORT || "2525");
const MAIL_SERVICE_USER = process.env.MAIL_SERVICE_USER;
const MAIL_SERVICE_PASS = process.env.MAIL_SERVICE_PASS;

if (!MAIL_SERVICE_USER || !MAIL_SERVICE_PASS) {
    throw new Error("Mail service credentials are not set in environment variables.");
}

const transporter = nodemailer.createTransport({
    host: MAIL_SERVICE_HOST,
    port: MAIL_SERVICE_PORT,
    auth: {
        user: MAIL_SERVICE_USER,
        pass: MAIL_SERVICE_PASS
    }
});

export async function ProcessNewsletter(queueItem: any, context: InvocationContext): Promise<void> {
    context.log("Service Bus queue message received:", queueItem);

    try {
        const emailData = typeof queueItem === "string" ? JSON.parse(queueItem) : queueItem;
        context.log(`Sending newsletter to: ${emailData.email}`);

        const info = await transporter.sendMail({
            from: '567780@mail.muni.cz',
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
