import { getDistance } from "geolib";
import { Coordinate } from "../../models/Coordinate";

export default function getStrippedPolylineByCoordinates(points: Coordinate[], distance: number): (any & Coordinate)[] {
    let filteredCoordinates = [
        points[0]
    ];

    for(let index = 1; index < points.length - 1; index++) {
        if(getDistance(points[index], filteredCoordinates[filteredCoordinates.length - 1]) >= distance)
            filteredCoordinates.push(points[index]);
    }

    filteredCoordinates.push(points[points.length - 1]);

    return filteredCoordinates;
};
