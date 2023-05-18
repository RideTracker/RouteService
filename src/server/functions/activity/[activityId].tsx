import React from "react";
import { ReactDOMResponse } from "react-cloudflare-pages-wrapper";

export function onRequest(context) {
    const themeBackground = context.request.headers.get("RideTracker-Theme-Background");

    const { activityId } = context.params;

    return ReactDOMResponse(
        <html>
            <head>
                <meta charSet="utf-8"/>

                <title>Serversided React DOM rendered page</title>

                <meta name="viewport" content="width=device-width, initial-scale=1"/>

                <link rel="stylesheet" href="/styles/global.min.css"/>
            </head>

            <body style={{ backgroundColor: themeBackground }}>
                <h1>Hello</h1>

                <h3>{activityId}</h3>
            </body>
        </html>
    );
};
