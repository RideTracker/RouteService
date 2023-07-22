import getActivitySessions from "../../../../controllers/activities/getActivitySessions";
import { Coordinate } from "../../../../models/Coordinate";
import { getDistance } from "geolib";

export async function handleActivitySessionsSpeedRequest(request: CfRequest, env: Env) {
    const { activityId } = request.params;

    const sessions = await getActivitySessions(env.BUCKET, activityId);

    if(!sessions)
        return Response.json({ success: false });

    const significantChange = 4;

    const polylines = sessions.map((session) => {
        const points: {
            coordinate: Coordinate;
            speed: number;
        }[] = [];

        const start = session.locations[0];
        const end = session.locations[1];

        points.push({
            coordinate: {
                latitude: start.coords.latitude,
                longitude: start.coords.longitude
            },

            speed: start.coords.speed
        });

        for(let index = 0; index < session.locations.length - 1; index++) {
            const location = session.locations[index];
            const previous = points[points.length - 1];

            const distance = getDistance(previous.coordinate, location.coords);

            // TODO: change to be a percentage of overall distance
            if(distance < 100) {
                console.log(`Skipping coordinate because ${distance} m is less than 100 m`);

                continue;
            }
            
            const difference = Math.abs(location.coords.speed - previous.speed);

            if(difference < significantChange) {
                console.log(`Skipping speed change because ${difference} is less than significant change of ${significantChange}`);

                continue;
            }
            
            points.push({
                coordinate: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                },

                speed: location.coords.speed
            });
        }
            
        points.push({
            coordinate: {
                latitude: end.coords.latitude,
                longitude: end.coords.longitude
            },

            speed: end.coords.speed
        });

        return points;
    });

    const speeds = polylines.flatMap((points) => points.map((point) => point.speed));

    const sum = speeds.reduce((accumulated, speed) => accumulated + speed, 0);
    const average = sum / speeds.length;

    return Response.json({
        success: true,

        speeds: {
            minimum: Math.min(...speeds),
            maximum: Math.max(...speeds),
            average
        },

        polylines: polylines.map((points) => {
            return {
                points: points.map((point) => {
                    return {
                        coordinate: {
                            latitude: point.coordinate.latitude,
                            longitude: point.coordinate.longitude
                        },

                        speed: point.speed
                    };
                })
            };
        })
    });
};
