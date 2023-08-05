import { getActivityById } from "../../../controllers/activities/getActivityById";
import getActivityRecording from "../../../controllers/activities/recordings/getActivityRecording";
import processActivityRecordingStartArea from "../../../controllers/activities/recordings/processing/processActivityRecordingStartArea";
import processActivityRecordingFinishArea from "../../../controllers/activities/recordings/processing/processActivityRecordingFinishArea";
import { deleteActivitySummaries } from "../../../controllers/activities/summaries/deleteActivitySummaries";
import processActivityRecordingSpeedSummary from "../../../controllers/activities/recordings/processing/processActivityRecordingSpeedSummary";
import processActivityRecordingDistanceSummary from "../../../controllers/activities/recordings/processing/processActivityRecordingDistanceSummary";
import processActivityRecordingElevationSummary from "../../../controllers/activities/recordings/processing/processActivityRecordingElevationSummary";
import processActivityRecordingPolylines from "../../../controllers/activities/recordings/processing/processActivityRecordingPolylines";
import { updateActivitySummaryPersonalBests } from "../../../controllers/activities/summaries/updateActivitySummaryPersonalBests";
import { updateActivityStatus } from "../../../controllers/activities/updateActivityStatus";

export async function handleActivityProcessRequest(request: CfRequest, env: Env, context: ExecutionContext) {
    const { activityId } = request.params;

    const activity = await getActivityById(env.DATABASE, activityId);

    if(!activity)
        return Response.json({ success: false });

    if(activity.status === "deleted")
        return Response.json({ success: false });
    
    const recording = await getActivityRecording(env.BUCKET, activity.id);

    if(!recording)
        return Response.json({ success: false });

    if(!recording.sessions.length)
        return Response.json({ success: false });

    // In the event that we're reprocessing, delete activity summaries
    await deleteActivitySummaries(env.DATABASE, activity.id);

    await Promise.allSettled<void>([
        processActivityRecordingStartArea(env, activity.id, recording),
        processActivityRecordingFinishArea(env, activity.id, recording),

        processActivityRecordingSpeedSummary(env, activity.id, recording),
        processActivityRecordingDistanceSummary(env, activity.id, recording),
        processActivityRecordingElevationSummary(env, activity.id, recording),

        processActivityRecordingPolylines(env, activity.id, recording)
    ]);

    await Promise.allSettled<void>([
        updateActivitySummaryPersonalBests(env.DATABASE, activity.user),
        
        updateActivityStatus(env.DATABASE, activity.id, "processed")
    ]);

    return Response.json({
        success: true,

        recording
    });
};
