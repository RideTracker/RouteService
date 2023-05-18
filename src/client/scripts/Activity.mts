declare const RouteRenderer: any;

const response = await fetch(window.location.href + "/sessions");
const sessions = await response.json();

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
    cameraRotation: [ 3, .5, 0 ]
});

renderer.registerMouseEvents(canvas);

renderer.setupContext(context);

renderer.setPaths(paths);

let previous = performance.now();
let rotation = 0;

function render(now) {
    rotation = (rotation + ((now - previous) / 1000 * 90)) % 360;
    previous = now;

    renderer.setOptions({
        cameraRotation: [ (rotation * Math.PI) / 180, .5, 0 ]
    });

    renderer.render(context, now);

    window.requestAnimationFrame((now) => render(now));
};

render(performance.now());
