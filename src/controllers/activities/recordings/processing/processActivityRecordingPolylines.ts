import { Recording, RecordingSessionCoordinate } from "@ridetracker/ridetrackertypes";
import getRecordingFirstItem from "../../../recordings/getRecordingFirstItem";
import getMapsAreaFromCoordinates from "../../../maps/getMapsAreaFromCoordinates";
import { updateActivityStartArea } from "../../updateActivityStartArea";
import { Coordinate } from "../../../../models/Coordinate";
import { encode } from "@googlemaps/polyline-codec";
import { getDistance } from "geolib";
import { updateActivityPolylines } from "../../updateActivityPolylines";

export default async function processActivityRecordingPolylines(env: Env, activityId: string, recording: Recording) {
    const polylines: string[] = [];

    recording.sessions.forEach((session) => {
        const significantCoordinates: Coordinate[] = [];

        if(session.coordinates.length >= 2) {
            significantCoordinates.push(session.coordinates[0].coordinate);

            let distance = 0;

            for(let index = 1; index < session.coordinates.length - 1; index++) {
                distance += getDistance(session.coordinates[index - 1].coordinate, session.coordinates[index].coordinate, session.coordinates[index].accuracy);

                if(distance > 20)
                    significantCoordinates.push(session.coordinates[index].coordinate);
            }

            if(session.coordinates.length > 2)
                significantCoordinates.push(session.coordinates[session.coordinates.length - 1].coordinate);
        }

        polylines.push(encode(significantCoordinates.map((coordinate) => [ coordinate.latitude, coordinate.longitude ])));
    });

    updateActivityPolylines(env.DATABASE, activityId, JSON.stringify(polylines));
};
