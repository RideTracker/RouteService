import { Recording } from "@ridetracker/ridetrackertypes";
import getActivityRecordingFromArray from "./getActivityRecordingFromArray";

export default async function getActivityRecording(bucket: R2Bucket, activityId: string): Promise<Recording | null> {
    const response = await bucket.get(`activities/${activityId}.json`);

    if(!response)
        return null;

    const result: any = await response.json();

    const version = (result.length !== undefined)?(1):(result.version);

    // We do not, ever, want to rewrite the original upload file;
    // instead, upgrade the recordings each time it has to be reprocessed;
    // or if reason be, migrate processed recordings to a new bucket folder.

    switch(version) {
        // Version 1 is an array of sessions with coords objects.
        case 1:
            return getActivityRecordingFromArray(result);

        // Version 2 is currently representated by the Recording type.
        case 2:
            return result;

        default:
            return null;
    }
};
