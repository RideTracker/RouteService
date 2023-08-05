import { Recording, RecordingSession, RecordingSessionAltitude, RecordingSessionBatteryState, RecordingSessionCoordinate, RecordingSessionSpeed, RecordingV1Session, RecordingV1SessionBatteryState } from "@ridetracker/ridetrackertypes";
import { getDistance } from "geolib";

export default function getActivityRecordingFromArray(sessions: RecordingV1Session[]): Recording | null {
    if(!sessions.length)
        return null;

    const recording: Recording = {
        // localId was implemented in RideTrackerApp-0.9.3
        id: sessions[0].id,

        version: 2,

        sessions: sessions.map<RecordingSession>((session) => {
            let distance = 0;
            let altitude = 0;
            let speed = 0;

            return {
                id: session.id,

                // Significant changes were not calculated prior to RideTrackerApp-0.9.3.

                coordinates: session.locations.filter((location, index, array) => {
                    if(index === 0 || index === array.length - 1)
                        return true;

                    distance += getDistance(array[index - 1].coords, location.coords);

                    if(distance < 10)
                        return false;

                    distance = 0;

                    return true;
                }).map<RecordingSessionCoordinate>((location) => {
                    return {
                        coordinate: {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        },

                        accuracy: location.coords.accuracy,
                        timestamp: location.timestamp
                    };
                }),

                altitudes: session.locations.filter((location, index, array) => {
                    if(index === 0 || index === array.length - 1)
                        return true;

                    if(Math.abs(location.coords.altitude - altitude) < 1)
                        return false;

                    altitude = location.coords.altitude;

                    return true;
                }).map<RecordingSessionAltitude>((location) => {
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

                speeds: session.locations.filter((location, index, array) => {
                    if(index === 0 || index === array.length - 1)
                        return true;

                    if(Math.abs(location.coords.speed - speed) < (1 / 3.6))
                        return false;

                    speed = location.coords.speed;

                    return true;
                }).map<RecordingSessionSpeed>((location) => {
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
