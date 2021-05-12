function setup() {
    createCanvas(N * scale, N * scale);
}

function setRed(red) {
    setup();
    fluid.red = red;
    draw();
}

function setBlue(blue) {
    setup();
    fluid.blue = blue;
    draw();
}

function setGreen(green) {
    setup();
    fluid.green = green;
    draw();
}

function updateDiffuse(diffuse) {
    setup();
    fluid.diffuse = diffuse;
    draw();
}

function updateViscosity(viscosity) {
    setup();
    fluid.viscosity = viscosity;
    draw();
}

function mouseDragged() {
    let x = int(mouseX / scale);
    let y = int(mouseY / scale);

    const velX = mouseX - pmouseX;
    const velY = mouseY - pmouseY;

    const densityToAdd = 10000;

    fluid.addDensity(x, y, densityToAdd);
    fluid.addVelocity(x, y, velX, velY);

    // for (let i = -1; i <= 1; i++) {
    //     for (let j = -1; j <= 1; j++) {
    // fluid.addDensity(x, y, densityToAdd);
    // fluid.addVelocity(x, y, velX, velY);
    //     }
    // }
}

function draw() {
    background(0);
    fluid.step();
    fluid.renderDensity();
}