import { Session } from "../../models/Session";

export default async function getActivitySessions(bucket: R2Bucket, activityId: string): Promise<Session[] | null> {
    const activity = await bucket.get(`activities/${activityId}.json`);

    if(!activity)
        return null;

    return await activity.json<Session[]>();
};
