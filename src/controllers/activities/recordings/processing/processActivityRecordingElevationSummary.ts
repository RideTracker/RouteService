import { Recording } from "@ridetracker/ridetrackertypes";
import { createActivitySummary } from "../../summaries/createActivitySummary";

export default async function processActivityRecordingElevationSummary(env: Env, activityId: string, recording: Recording) {
    let elevation = 0;

    recording.sessions.forEach((session) => {
        if(session.altitudes.length < 2)
            return;

        for(let index = 1; index < session.altitudes.length; index++) {
            elevation += Math.max(0, Math.min(session.altitudes[index].altitude - session.altitudes[index - 1].altitude, session.altitudes[index].accuracy));
        }
    });

    await createActivitySummary(env.DATABASE, activityId, "elevation", elevation);
};
