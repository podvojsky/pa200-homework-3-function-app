import { app, InvocationContext } from "@azure/functions";

export async function ProcessNewsletter(queueItem: any, context: InvocationContext): Promise<void> {
    context.log("Service Bus queue message received:", queueItem);

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
