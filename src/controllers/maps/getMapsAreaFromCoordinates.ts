import { Coordinate } from "../../models/Coordinate";

export default async function getMapsAreaFromCoordinates(googleMapsApiKey: string, coordinate: Coordinate): Promise<string | null> {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${googleMapsApiKey}`);

    if(!response.ok)
        return null;

    const data = await response.json<any>();

    if(!data.results.length)
        return null;

    for(let result of data.results) {
        const name = result.address_components.find((component: any) => component.types.includes("postal_town")) ?? result.address_components.find((component: any) => component.types.includes("political")) ?? result.address_components.find((component: any) => component.types.includes("country"));

        if(!name)
            continue;

        return name;
    }

    return null;
};
