export async function handleActivitySessionsRequest(request: CfRequest, env: Env) {
    const { activityId } = request.params;

    const bucket = await env.BUCKET.get(`activities/${activityId}.json`);

    if(!bucket)
        return Response.json({ success: false });

    const sessions = await bucket.json();

    return Response.json(sessions);
};
