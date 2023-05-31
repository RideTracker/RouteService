import React from "react";
import { ReactDOMResponse } from "react-cloudflare-pages-wrapper";

export async function handleActivityRouteRequest(request: CfRequest, env: Env) {
    const { activityId } = request.params;

    return ReactDOMResponse(
        <html style={{ height: "100%" }}>
            <head>
                <meta charSet="utf-8"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>

                <title>Activity Route</title>
            </head>

            <body style={{ backgroundColor: "transparent", height: "100%", overflow: "hidden", margin: 0 }}>
                <canvas id="canvas" style={{
                    width: "100%",
                    height: "100%"
                }}></canvas>

                <script src="https://unpkg.com/gl-matrix@2.8.1/dist/gl-matrix-min.js"></script>
                <script src="https://unpkg.com/routerenderer@0.9.4/dist/bundle.mjs"></script>

                <script type="module" dangerouslySetInnerHTML={{
                    __html: `
                        const response = await fetch("/api/activities/${activityId}/sessions");
                        const sessions = await response.json();

                        const paths = sessions.map((session) => session.locations.map((location, index) => {
                            return {
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                altitude: location.coords.altitude + (index * .5)
                            };
                        }));

                        const canvas = document.getElementById("canvas");

                        canvas.width = screen.width;
                        canvas.height = screen.height;

                        const context = canvas.getContext("webgl", {
                            premultipliedAlpha: true
                        });

                        const renderer = new RouteRenderer.Renderer({
                            topColor: [ 187, 135, 252, 255 ],

                            elevationGradient: true,
                            
                            cameraFov: 20,
                            cameraRotation: [ 3, .5, 0 ]
                        });

                        renderer.registerMouseEvents(canvas);

                        renderer.setupContext(context);

                        renderer.setPaths(paths);

                        let previous = performance.now();
                        let rotation = 0;

                        function render(now) {
                            rotation = (rotation + ((now - previous) / 2000 * 90)) % 360;
                            previous = now;

                            renderer.setOptions({
                                cameraRotation: [ 360 - ((rotation * Math.PI) / 180), .5, 0 ]
                            });

                            renderer.render(context, now);

                            window.requestAnimationFrame((now) => render(now));
                        };

                        render(performance.now());
                        `
                    }}>
                </script>
            </body>
        </html>
    );
};
