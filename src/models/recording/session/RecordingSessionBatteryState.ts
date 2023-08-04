export type RecordingSessionBatteryState = {
    batteryState: {
        batteryLevel: number;
        batteryState: "UNKNOWN" | "UNPLUGGED" | "CHARGING" | "FULL";
        lowPowerMode: boolean;
    };
    timestamp: number;
};
