import { Recording } from "@ridetracker/ridetrackertypes";
import { createActivitySummary } from "../../summaries/createActivitySummary";

export default async function processActivityRecordingSpeedSummary(env: Env, activityId: string, recording: Recording) {
    const speeds = recording.sessions.flatMap((session) => session.speeds);

    const maxSpeed = speeds.reduce((highest, current) => {
        if(current.speed > highest)
            return current.speed;

        return highest;
    }, 0);

    const speedSum = speeds.reduce((accumulated, current) => accumulated + current.speed, 0);
    const averageSpeed = (speedSum / speeds.length) || 0;

    await Promise.allSettled([
        createActivitySummary(env.DATABASE, activityId, "average_speed", averageSpeed),
        createActivitySummary(env.DATABASE, activityId, "max_speed", maxSpeed)
    ]);
};
