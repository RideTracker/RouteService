import React from "react";
import { ReactDOMResponse } from "react-cloudflare-pages-wrapper";

export async function onRequest(context) {
    const env: Env = context.env;

    const themeBackground = context.request.headers.get("RideTracker-Theme-Background");

    const { activityId } = context.params;

    return ReactDOMResponse(
        <html>
            <head>
                <meta charSet="utf-8"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>

                <title>Activity Route</title>

                <link rel="stylesheet" href="/styles/global.min.css"/>
            </head>

            <body style={{ backgroundColor: themeBackground }}>
                <canvas id="canvas"></canvas>

                <script src="https://unpkg.com/gl-matrix@2.8.1/dist/gl-matrix-min.js"></script>
                <script src="https://unpkg.com/routerenderer@0.9.2/dist/bundle.mjs"></script>

                <script src="scripts/Activity.js" type="module"></script>
            </body>
        </html>
    );
};
