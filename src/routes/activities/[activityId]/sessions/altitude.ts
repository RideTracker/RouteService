import getActivitySessions from "../../../../controllers/activities/getActivitySessions";
import { Coordinate } from "../../../../models/Coordinate";
import { getDistance } from "geolib";

export async function handleActivitySessionsAltitudeRequest(request: CfRequest, env: Env) {
    const { activityId } = request.params;

    const sessions = await getActivitySessions(env.BUCKET, activityId);

    if(!sessions)
        return Response.json({ success: false });

    const significantChange = 1;

    const polylines = sessions.map((session) => {
        const points: {
            coordinate: Coordinate;
            altitude: number;
        }[] = [];

        const start = session.locations[0];
        const end = session.locations[1];

        points.push({
            coordinate: {
                latitude: start.coords.latitude,
                longitude: start.coords.longitude
            },

            altitude: start.coords.altitude
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

            const difference = Math.abs(location.coords.altitude - previous.altitude);

            if(difference < location.coords.altitudeAccuracy) {
                console.log(`Skipping altitude elevation because ${difference} is less than accuracy of ${location.coords.altitudeAccuracy}`);

                continue;
            }

            if(difference < significantChange) {
                console.log(`Skipping altitude elevation because ${difference} is less than significant change of ${significantChange}`);

                continue;
            }
            
            points.push({
                coordinate: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                },

                altitude: location.coords.altitude
            });
        }
            
        points.push({
            coordinate: {
                latitude: end.coords.latitude,
                longitude: end.coords.longitude
            },

            altitude: end.coords.altitude
        });

        return points;
    });

    const altitudes = polylines.flatMap((points) => points.map((point) => point.altitude));

    const sum = altitudes.reduce((accumulated, altitude) => accumulated + altitude, 0);
    const average = sum / altitudes.length;

    return Response.json({
        success: true,

        altitudes: {
            minimum: Math.min(...altitudes),
            maximum: Math.max(...altitudes),
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

                        altitude: point.altitude
                    };
                })
            };
        })
    });
};
