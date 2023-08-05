export async function updateActivityStartArea(database: D1Database, id: string, startArea: string | null): Promise<void> {
    await database.prepare("UPDATE activities SET start_area = ? WHERE id = ?").bind(startArea, id).run();
};
