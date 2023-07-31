import getActivitySessions from "../../../../controllers/activities/sessions/getActivitySessions";
import createActivitySessionsInsights from "../../../../controllers/activities/sessions/insights/createActivitySessionsInsights";
import getActivitySessionsInsights from "../../../../controllers/activities/sessions/insights/getActivitySessionsInsights";
import getSignificantAltitudeChanges from "../../../../controllers/polylines/getSignificantAltitudeChanges";
import getSignificantSpeedChanges from "../../../../controllers/polylines/getSignificantSpeedChanges";
import getSignificantStats from "../../../../controllers/polylines/getSignificantStats";
import { SessionsInsights } from "../../../../models/SessionsInsights";

export async function handleActivitySessionsInsightsRequest(request: CfRequest, env: Env, context: ExecutionContext) {
    const { activityId } = request.params;

    const insights = await getActivitySessionsInsights(env.BUCKET, activityId);

    if(!insights) {
        const sessions = await getActivitySessions(env.BUCKET, activityId);

        if(!sessions)
            return Response.json({ success: false });

        const polylines = sessions.map((session) => {
            return {
                speed: getSignificantSpeedChanges(session.locations),
                altitude: getSignificantAltitudeChanges(session.locations),
                battery: session.battery ?? []
            };
        });

        const speedStats = getSignificantStats(polylines.flatMap((points) => points.speed.map((point) => point.speed)));
        const altitudeStats = getSignificantStats(polylines.flatMap((points) => points.altitude.map((point) => point.altitude)));

        const insights: SessionsInsights = {
            speed: {
                stats: {
                    minimum: speedStats.minimum,
                    average: speedStats.average,
                    maximum: speedStats.maximum
                },

                polylines: polylines.map((polyline, index) => {
                    return {
                        distanceOffset: polylines.slice(0, index).reduce((accumulated, polyline) => accumulated + (polyline.speed[polyline.speed.length - 1]?.distance ?? 0), 0),

                        points: polyline.speed.map((point) => {
                            return {
                                coordinate: {
                                    latitude: point.coordinate.latitude,
                                    longitude: point.coordinate.longitude
                                },

                                speed: point.speed,

                                distance: point.distance
                            };
                        })
                    };
                })
            },

            altitude: {
                stats: {
                    minimum: altitudeStats.minimum,
                    average: altitudeStats.average,
                    maximum: altitudeStats.maximum
                },

                polylines: polylines.map((polyline, index) => {
                    return {
                        distanceOffset: polylines.slice(0, index).reduce((accumulated, polyline) => accumulated + (polyline.speed[polyline.speed.length - 1]?.distance ?? 0), 0),
                        
                        points: polyline.altitude.map((point) => {
                            return {
                                coordinate: {
                                    latitude: point.coordinate.latitude,
                                    longitude: point.coordinate.longitude
                                },

                                altitude: point.altitude,

                                distance: point.distance
                            };
                        })
                    };
                })
            },

            battery: {
                polylines: polylines.map((polyline) => {
                    return {
                        points: polyline.battery.map((battery) => {
                            return {
                                batteryLevel: battery.batteryLevel,
                                batteryState: battery.batteryState,
                                lowPowerMode: battery.lowPowerMode,
                                timestamp: battery.timestamp
                            };
                        })
                    };
                })
            }
        };

        context.waitUntil(createActivitySessionsInsights(env.BUCKET, activityId, insights));

        return Response.json({
            success: true,

            insights
        });
    }

    return Response.json({
        success: true,

        insights
    });
};
