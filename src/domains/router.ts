import { ThrowableRouter, withParams } from "itty-router-extras";
import { handleActivityRouteRequest } from "../routes/activities/[activityId]/route";
import { handleActivitySessionsRequest } from "../routes/activities/[activityId]/sessions";
import { withAuth } from "@ridetracker/authservice";
import { handleActivitySessionsAltitudeRequest } from "../routes/activities/[activityId]/sessions/altitude";
import { handleActivitySessionsSpeedRequest } from "../routes/activities/[activityId]/sessions/speed";
import { handleActivitySessionsInsightsRequest } from "../routes/activities/[activityId]/sessions/insights";
import { handleActivityProcessRequest } from "../routes/activities/[activityId]/process";

export default function createRouter() {
    const router = ThrowableRouter();
    
    router.get("/activities/:activityId/route", withAuth("user", "DATABASE"), withParams, handleActivityRouteRequest);
    router.post("/api/activities/:activityId/process", withAuth("service", "DATABASE"), withParams, handleActivityProcessRequest);
    router.get("/api/activities/:activityId/sessions", withAuth("user", "DATABASE"), withParams, handleActivitySessionsRequest);
    router.get("/api/activities/:activityId/sessions/insights", withAuth("user", "DATABASE"), withParams, handleActivitySessionsInsightsRequest);

    return router;
};
