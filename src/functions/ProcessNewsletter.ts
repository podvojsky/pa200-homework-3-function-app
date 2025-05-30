import { app, InvocationContext } from "@azure/functions";

export async function ProcessNewsletter(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);
}

app.storageQueue('ProcessNewsletter', {
    queueName: 'js-queue-items',
    connection: '',
    handler: ProcessNewsletter
});
