import { Recording } from "@ridetracker/ridetrackertypes";
import { createActivitySummary } from "../../summaries/createActivitySummary";
import { getDistance } from "geolib";

export default async function processActivityRecordingDistanceSummary(env: Env, activityId: string, recording: Recording) {
    let distance = 0;

    recording.sessions.forEach((session) => {
        if(session.coordinates.length < 2)
            return;

        for(let index = 1; index < session.coordinates.length; index++) {
            distance += getDistance(session.coordinates[index - 1].coordinate, session.coordinates[index].coordinate, session.coordinates[index].accuracy);
        }
    });

    await createActivitySummary(env.DATABASE, activityId, "distance", distance);
};
