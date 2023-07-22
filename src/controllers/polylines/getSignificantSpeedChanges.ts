import { Coordinate } from "../../models/Coordinate";
import { Session } from "../../models/Session";
import { getDistance } from "geolib";

const significantChange = 4;

// TODO: change to be a percentage of overall distance
const significantDistance = 100;

export default function getSignificantSpeedChanges(locations: Session["locations"]) {
    const points: {
        coordinate: Coordinate;
        speed: number;
    }[] = [];

    const start = locations[0];
    const end = locations[1];

    points.push({
        coordinate: {
            latitude: start.coords.latitude,
            longitude: start.coords.longitude
        },

        speed: start.coords.speed
    });

    for(let index = 0; index < locations.length - 1; index++) {
        const location = locations[index];
        const previous = points[points.length - 1];

        const distance = getDistance(previous.coordinate, location.coords);

        if(distance < significantDistance) {
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
};
