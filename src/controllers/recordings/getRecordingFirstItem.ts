import { Recording, RecordingSession, RecordingSessionCoordinate } from "@ridetracker/ridetrackertypes";

export default function getRecordingFirstItem<T>(recording: Recording, key: keyof RecordingSession): T | null {
    for(let index = 0; index < recording.sessions.length; index++) {
        const session = recording.sessions[index];

        if(!session[key].length)
            continue;

        return session[key][0] as T;
    }

    return null;
};
