/* eslint-disable no-plusplus */

class Fluid {
    constructor(timestep, diffuse, viscosity) {
        this.timestep = timestep;
        this.diffuse = diffuse;
        this.viscosity = viscosity;

        this.prevDensity = new Array(N * N).fill(0);
        this.density = new Array(N * N).fill(0);

        this.vx = new Array(N * N).fill(0);
        this.vy = new Array(N * N).fill(0);

        this.prevVx = new Array(N * N).fill(0);
        this.prevVy = new Array(N * N).fill(0);
        this.red = 0.5;
        this.green = 0.5;
        this.blue = 0.5;
    }

    addDensity(x, y, densityToAdd) {
        this.density[arrayIndex(x, y)] += densityToAdd;
    }

    set setDiffuse(diffuse) {
        this.diffuse = diffuse;
    }

    set setVisc(visc) {
        this.visc = visc;
    }

    addVelocity(x, y, velX, velY) {
        this.vx[arrayIndex(x, y)] += velX;
        this.vy[arrayIndex(x, y)] += velY;
    }

    renderDensity() {
        let i;
        let j;
        for (i = 0; i < N; i++) {
            for (j = 0; j < N; j++) {
                const x = i * scale;
                const y = j * scale;
                const ind = arrayIndex(i, j);
                const d = this.density[ind];
                noStroke();
                fill(d * this.red, d * this.green, d * this.blue);

                rect(x, y, scale, scale);
            }
        }
    }

    step() {
        diffusion(1, this.prevVx, this.vx, this.viscosity, this.timestep);
        diffusion(2, this.prevVy, this.vy, this.viscosity, this.timestep);

        project(this.prevVx, this.prevVy, this.vx, this.vy);

        advect(1, this.vx, this.prevVx, this.prevVx, this.prevVy, this.timestep);
        advect(2, this.vy, this.prevVy, this.prevVx, this.prevVy, this.timestep);

        project(this.vx, this.vy, this.prevVx, this.prevVy);
        diffusion(0, this.prevDensity, this.density, this.diffuse, this.timestep);
        advect(0, this.density, this.prevDensity, this.vx, this.vy, this.timestep);
    }
}