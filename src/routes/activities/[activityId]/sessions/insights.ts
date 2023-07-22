import getActivitySessions from "../../../../controllers/activities/getActivitySessions";
import getSignificantAltitudeChanges from "../../../../controllers/polylines/getSignificantAltitudeChanges";
import getSignificantSpeedChanges from "../../../../controllers/polylines/getSignificantSpeedChanges";
import getSignificantStats from "../../../../controllers/polylines/getSignificantStats";

export async function handleActivitySessionsInsightsRequest(request: CfRequest, env: Env) {
    const { activityId } = request.params;

    const sessions = await getActivitySessions(env.BUCKET, activityId);

    if(!sessions)
        return Response.json({ success: false });

    const polylines = sessions.map((session) => {
        return {
            speed: getSignificantSpeedChanges(session.locations),
            altitude: getSignificantAltitudeChanges(session.locations),
            battery: session.battery
        };
    });

    const speedStats = getSignificantStats(polylines.flatMap((points) => points.speed.map((point) => point.speed)));
    const altitudeStats = getSignificantStats(polylines.flatMap((points) => points.altitude.map((point) => point.altitude)));

    return Response.json({
        success: true,

        speed: {
            stats: {
                minimum: speedStats.minimum,
                average: speedStats.average,
                maximum: speedStats.maximum
            },

            polylines: polylines.map((polyline) => {
                return polyline.speed.map((point) => {
                    return {
                        coordinate: {
                            latitude: point.coordinate.latitude,
                            longitude: point.coordinate.longitude
                        },

                        speed: point.speed
                    };
                })
            })
        },

        altitude: {
            stats: {
                minimum: altitudeStats.minimum,
                average: altitudeStats.average,
                maximum: altitudeStats.maximum
            },

            polylines: polylines.map((polyline) => {
                return polyline.altitude.map((point) => {
                    return {
                        coordinate: {
                            latitude: point.coordinate.latitude,
                            longitude: point.coordinate.longitude
                        },

                        altitude: point.altitude
                    };
                })
            })
        },

        battery: polylines.map((polyline) => {
            return polyline.battery.map((battery) => {
                return {
                    batteryLevel: battery.batteryLevel,
                    batteryState: battery.batteryState,
                    lowPowerMode: battery.lowPowerMode,
                    timestamp: battery.timestamp
                };
            })
        })
    });
};
