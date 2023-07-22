export default function getSignificantStats(items: number[]) {
    const sum = items.reduce((accumulated, speed) => accumulated + speed, 0);
    const average = sum / items.length;

    return {
        minimum: Math.min(...items),
        maximum: Math.max(...items),
        average
    };
};
