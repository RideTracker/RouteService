import { Recording, RecordingSessionCoordinate } from "@ridetracker/ridetrackertypes";
import getMapsAreaFromCoordinates from "../../../maps/getMapsAreaFromCoordinates";
import getRecordingLastItem from "../../../recordings/getRecordingLastItem";
import { updateActivityFinishArea } from "../../updateActivityFinishArea";

export default async function processActivityRecordingFinishArea(env: Env, activityId: string, recording: Recording) {
    const lastCoordinate = getRecordingLastItem<RecordingSessionCoordinate>(recording, "coordinates");

    if(!lastCoordinate) {
        console.warn("Failed to find an initial coordinate.");

        return;
    }

    const result = await getMapsAreaFromCoordinates(env.GOOGLE_MAPS_API_KEY, lastCoordinate.coordinate);

    await updateActivityFinishArea(env.DATABASE, activityId, result);
};
