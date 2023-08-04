export type SessionsInsights = {
    speed: {
        stats: {
            minimum: number;
            maximum: number;
            average: number;
        };
        
        polylines: {
            distanceOffset: number;
            
            points: {
                coordinate: {
                    latitude: number;
                    longitude: number;
                };

                speed: number;

                distance: number;
            }[];
        }[];
    };
    
    altitude: {
        stats: {
            minimum: number;
            maximum: number;
            average: number;
        };
        
        polylines: {
            distanceOffset: number;
            
            points: {
                coordinate: {
                    latitude: number;
                    longitude: number;
                };

                altitude: number;
                
                distance: number;
            }[];
        }[];
    };

    battery: {
        polylines: {
            points: {
                batteryLevel: number;
                batteryState: number;
                lowPowerMode?: boolean;
                
                timestamp: number;
            }[];
        }[];
    };
};
