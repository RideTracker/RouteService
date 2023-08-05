import { Recording, RecordingSessionCoordinate } from "@ridetracker/ridetrackertypes";
import getRecordingFirstItem from "../../../recordings/getRecordingFirstItem";
import getMapsAreaFromCoordinates from "../../../maps/getMapsAreaFromCoordinates";
import { updateActivityStartArea } from "../../updateActivityStartArea";

export default async function processActivityRecordingStartArea(env: Env, activityId: string, recording: Recording) {
    const firstCoordinate = getRecordingFirstItem<RecordingSessionCoordinate>(recording, "coordinates");

    if(!firstCoordinate) {
        console.warn("Failed to find an initial coordinate.");

        return;
    }

    const result = await getMapsAreaFromCoordinates(env.GOOGLE_MAPS_API_KEY, firstCoordinate.coordinate);

    await updateActivityStartArea(env.DATABASE, activityId, result);
};
