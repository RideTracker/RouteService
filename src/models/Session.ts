enum BatteryState {
    UNKNOWN = 0,
    UNPLUGGED,
    CHARGING,
    FULL
};

export type Session = {
    id: string;
    locations: {
        coords: {
            latitude: number;
            longitude: number;
            accuracy: number;

            altitude: number;
            altitudeAccuracy: number;
            
            heading: number;
            speed: number;
        };

        timestamp: number;
    }[];

    battery: {
        batteryLevel: number;
        batteryState: BatteryState;
        lowPowerMode: boolean;
        timestamp: number;
    }[];
};
