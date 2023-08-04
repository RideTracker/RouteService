import { Session } from "../../../../models/Session";

export default async function getActivitySessionsInsights(bucket: R2Bucket, activityId: string): Promise<Session[] | null> {
    const activity = await bucket.get(`activities/insights/${activityId}.json`);

    if(!activity)
        return null;

    return await activity.json<Session[]>();
};
