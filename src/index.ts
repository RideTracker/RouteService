import createRouter from "./domains/router";

const router = createRouter();

async function getRequest(request: any, env: any, context: any) {
    const response: Response = await router.handle(request, env);

    if(!response) {
        return new Response(undefined, {
            status: 404,
            statusText: "File Not Found"
        })
    }

    return response;
}

export default {
    async fetch(request: Request, env: Env, context: ExecutionContext) {
        try {
            const response = await getRequest(request, env, context);

            if(response.status < 200 || response.status > 299) { 
                context.waitUntil(env.ANALYTICS_SERVICE.fetch(env.ANALYTICS_SERVICE_HOST + "/api/error", {
                    method: "POST",
                    headers: {
                        "Authorization": `Basic ${env.ANALYTICS_SERVICE_CLIENT_ID}:${env.ANALYTICS_SERVICE_CLIENT_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        error: "SERVER_ERROR",
                        data: "A response has returned a server error status code.",
                        service: "RouteService",
                        environment: env.ENVIRONMENT,
                        payload: JSON.stringify({
                            response: {
                                statusCode: response.status,
                                statusText: response.statusText,
                                responseBody: await response.text()
                            },
                            request: {
                                userAgent: request.headers.get("User-Agent"),
                                resource: `${request.method} ${request.url}`,
                                remoteAddress: request.headers.get("CF-Connecting-IP")
                            }
                        })
                    })
                }));
            }

            response.headers.set("Access-Control-Allow-Origin", "*");
            response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            
            return response;
        }
        catch(error: any) {
            if(error instanceof Error) {
                if(error.message.startsWith("D1_")) {
                    context.waitUntil(env.ANALYTICS_SERVICE.fetch(env.ANALYTICS_SERVICE_HOST + "/api/error", {
                        method: "POST",
                        headers: {
                            "Authorization": `Basic ${env.ANALYTICS_SERVICE_CLIENT_ID}:${env.ANALYTICS_SERVICE_CLIENT_TOKEN}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            error: "D1_ERROR",
                            data: "An error was thrown by D1 during execution.",
                            service: "RouteService",
                            environment: env.ENVIRONMENT,
                            payload: JSON.stringify({
                                error,
                                request: {
                                    userAgent: request.headers.get("User-Agent"),
                                    resource: `${request.method} ${request.url}`,
                                    remoteAddress: request.headers.get("CF-Connecting-IP")
                                }
                            })
                        })
                    }));
                
                    return new Response(undefined, {
                        status: 502,
                        statusText: "Bad Gateway"
                    });
                }
            }

            context.waitUntil(env.ANALYTICS_SERVICE.fetch(env.ANALYTICS_SERVICE_HOST + "/api/error", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${env.ANALYTICS_SERVICE_CLIENT_ID}:${env.ANALYTICS_SERVICE_CLIENT_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    error: "SERVER_ERROR",
                    data: "An uncaught error was thrown during a response.",
                    service: "RouteService",
                    environment: env.ENVIRONMENT,
                    payload: JSON.stringify({
                        error,
                        request: {
                            userAgent: request.headers.get("User-Agent"),
                            resource: `${request.method} ${request.url}`,
                            remoteAddress: request.headers.get("CF-Connecting-IP")
                        }
                    })
                })
            }));

            return new Response(undefined, {
                status: 500,
                statusText: "Internal Server Error"
            });
        }
    }
};
