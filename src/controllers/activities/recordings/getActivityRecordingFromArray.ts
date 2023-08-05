import { Recording, RecordingSession, RecordingSessionAltitude, RecordingSessionBatteryState, RecordingSessionCoordinate, RecordingSessionSpeed, RecordingV1Session, RecordingV1SessionBatteryState } from "@ridetracker/ridetrackertypes";

export default function getActivityRecordingFromArray(sessions: RecordingV1Session[]): Recording | null {
    if(!sessions.length)
        return null;

    const recording: Recording = {
        // localId was implemented in RideTrackerApp-0.9.3
        id: sessions[0].id,

        version: 2,

        sessions: sessions.map<RecordingSession>((session) => {
            return {
                id: session.id,

                coordinates: session.locations.map<RecordingSessionCoordinate>((location) => {
                    return {
                        coordinate: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        },

                        accuracy: location.coords.accuracy,
                        timestamp: location.timestamp
                    };
                }),

                altitudes: session.locations.map<RecordingSessionAltitude>((location) => {
                    return {
                        altitude: location.coords.altitude,
                        accuracy: location.coords.altitudeAccuracy,
                        timestamp: location.timestamp
                    };
                }),

                batteryStates: (session.battery ?? []).map<RecordingSessionBatteryState>((battery) => {
                    let batteryState: RecordingSessionBatteryState["batteryState"]["batteryState"] = "UNKNOWN";

                    switch(battery.batteryState) {
                        case RecordingV1SessionBatteryState.UNKNOWN: {
                            batteryState = "UNKNOWN";

                            break;
                        };

                        case RecordingV1SessionBatteryState.UNPLUGGED: {
                            batteryState = "UNPLUGGED";

                            break;
                        };

                        case RecordingV1SessionBatteryState.CHARGING: {
                            batteryState = "CHARGING";

                            break;
                        };

                        case RecordingV1SessionBatteryState.FULL: {
                            batteryState = "FULL";

                            break;
                        };
                    }

                    return {
                        batteryState: {
                            batteryState,
                            batteryLevel: battery.batteryLevel,
                            lowPowerMode: battery.lowPowerMode
                        },

                        timestamp: battery.timestamp
                    }
                }),

                speeds: session.locations.map<RecordingSessionSpeed>((location) => {
                    return {
                        speed: location.coords.speed,
                        accuracy: location.coords.accuracy,
                        timestamp: location.timestamp
                    };
                }),
                
                calories: [],
                
                heartRates: []
            }
        })
    }

    return recording;
};
