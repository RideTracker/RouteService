import { ThrowableRouter, withParams } from "itty-router-extras";
import { handleActivityRouteRequest } from "../routes/activities/[activityId]/route";
import { handleActivitySessionsRequest } from "../routes/activities/[activityId]/sessions";

export default function createRouter() {
    const router = ThrowableRouter();
    
    router.get("/activities/:activityId/route", withParams, handleActivityRouteRequest)
    router.get("/api/activities/:activityId/sessions", withParams, handleActivitySessionsRequest)

    return router;
};
