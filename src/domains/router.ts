import { ThrowableRouter, withParams } from "itty-router-extras";
import { handleActivityRouteRequest } from "../routes/activities/[activityId]/route";
import { handleActivitySessionsRequest } from "../routes/activities/[activityId]/sessions";
import { withAuth } from "@ridetracker/authservice";
import { handleActivitySessionsAltitudeRequest } from "../routes/activities/[activityId]/sessions/altitude";

export default function createRouter() {
    const router = ThrowableRouter();
    
    router.get("/activities/:activityId/route", withAuth("user", "DATABASE"), withParams, handleActivityRouteRequest);
    router.get("/api/activities/:activityId/sessions", withAuth("user", "DATABASE"), withParams, handleActivitySessionsRequest);
    router.get("/api/activities/:activityId/sessions/altitude", withAuth("user", "DATABASE"), withParams, handleActivitySessionsAltitudeRequest);

    return router;
};
