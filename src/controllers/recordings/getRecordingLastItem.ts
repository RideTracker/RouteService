import { Recording, RecordingSession } from "@ridetracker/ridetrackertypes";

export default function getRecordingLastItem<T>(recording: Recording, key: keyof RecordingSession): T | null {
    for(let index = recording.sessions.length - 1; index !== -1; index--) {
        const session = recording.sessions[index];
        
        if(!session[key].length)
            continue;

        return session[key][session[key].length - 1] as T;
    }

    return null;
};
