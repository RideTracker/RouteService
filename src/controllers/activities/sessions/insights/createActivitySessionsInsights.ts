import { Session } from "../../../../models/Session";
import { SessionsInsights } from "../../../../models/SessionsInsights";

export default async function createActivitySessionsInsights(bucket: R2Bucket, activityId: string, insights: SessionsInsights): Promise<void> {
    await bucket.put(`activities/insights/${activityId}.json`, JSON.stringify(insights), {
        customMetadata: {
            "type": "insights",
            "activity": activityId
        }
    });
};
