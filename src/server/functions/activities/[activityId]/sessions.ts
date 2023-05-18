export async function onRequest(context) {
    const env: Env = context.env;

    const { activityId } = context.params;

    const bucket = await env.BUCKET.get(`activities/${activityId}.json`);

    if(!bucket)
        return Response.json({ success: false });

    const sessions = await bucket.json();

    return Response.json(sessions);
};
