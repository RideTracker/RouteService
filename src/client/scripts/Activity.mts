declare const RouteRenderer: any;

const response = await fetch("./sessions");
const sessions = await response.json();

function render(renderer, context, now) {
    renderer.render(context, now);

    window.requestAnimationFrame((now) => render(renderer, context, now));
};

const paths = sessions.map((session) => session.locations.map((location, index) => {
    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude + (index * .5)
    };
}));

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

canvas.width = screen.width;
canvas.height = screen.height;

const context = canvas.getContext("webgl", {
    premultipliedAlpha: true
});

const renderer = new RouteRenderer.Renderer({
    topColor: [ 187, 135, 252, 255 ],

    elevationGradient: true,
    
    cameraFov: 20,
    cameraRotation: [ 3, .5, 0 ],

    grid: true,
    gridPadding: 100000,
    gridColor: [ 35, 44, 60, 255 ]
});

renderer.registerMouseEvents(canvas);

renderer.setupContext(context);

renderer.setPaths(paths);

render(renderer, context, performance.now());
