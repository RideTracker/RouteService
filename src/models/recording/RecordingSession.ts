import { RecordingSessionAltitude } from "./session/RecordingSessionAltitude";
import { RecordingSessionBatteryState } from "./session/RecordingSessionBatteryState";
import { RecordingSessionCalories } from "./session/RecordingSessionCalories";
import { RecordingSessionCoordinate } from "./session/RecordingSessionCoordinate";
import { RecordingSessionHeartRate } from "./session/RecordingSessionHeartRate";

export type RecordingSession = {
    id: string;
    coordinates: RecordingSessionCoordinate[];
    altitudes: RecordingSessionAltitude[];
    batteryStates: RecordingSessionBatteryState[];
    heartRates: RecordingSessionHeartRate[];
    calories: RecordingSessionCalories[];
};
