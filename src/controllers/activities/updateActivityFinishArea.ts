export async function updateActivityFinishArea(database: D1Database, id: string, finishArea: string | null): Promise<void> {
    await database.prepare("UPDATE activities SET finish_area = ? WHERE id = ?").bind(finishArea, id).run();
};
