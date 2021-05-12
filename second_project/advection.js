/* eslint-disable no-plusplus */
function arrayIndex(x, y) {
    x = constrain(x, 0, N - 1);
    y = constrain(y, 0, N - 1);
    return x + (y * N);
}

function set_bnd(b, x) {
    let i;
    let j;
    for (i = 1; i < N - 1; i++) {
        if (b === 2) {
            x[arrayIndex(i, 0)] = -x[arrayIndex(i, 1)];
            x[arrayIndex(i, N - 1)] = -x[arrayIndex(i, N - 2)];
        } else {
            x[arrayIndex(i, 0)] = x[arrayIndex(i, 1)];
            x[arrayIndex(i, N - 1)] = x[arrayIndex(i, N - 2)];
        }
    }

    for (j = 1; j < N - 1; j++) {
        if (b === 1) {
            x[arrayIndex(0, j)] = -x[arrayIndex(1, j)];
            x[arrayIndex(N - 1, j)] = -x[arrayIndex(N - 2, j)];

        } else {
            x[arrayIndex(0, j)] = x[arrayIndex(1, j)];
            x[arrayIndex(N - 1, j)] = x[arrayIndex(N - 2, j)];
        }
    }

    x[arrayIndex(0, 0)] = 0.5 * (x[arrayIndex(1, 0)] + x[arrayIndex(0, 1)]);
    x[arrayIndex(0, N - 1)] = 0.5 * (x[arrayIndex(1, N - 1)] + x[arrayIndex(0, N - 2)]);
    x[arrayIndex(N - 1, 0)] = 0.5 * (x[arrayIndex(N - 2, 0)] + x[arrayIndex(N - 1, 1)]);
    x[arrayIndex(N - 1, N - 1)] = 0.5 * (x[arrayIndex(N - 2, N - 1)] + x[arrayIndex(N - 1, N - 2)]);
}

function lin_solve(b, x, prevX, a, c) {
    let iter;
    let j;
    let i;
    for (iter = 0; iter < iterations; iter++) {
        for (j = 1; j < N - 1; j++) {
            for (i = 1; i < N - 1; i++) {
                x[arrayIndex(i, j)] = (prevX[arrayIndex(i, j)] +
                    a * (x[arrayIndex(i + 1, j)] +
                        x[arrayIndex(i - 1, j)] +
                        x[arrayIndex(i, j + 1)] +
                        x[arrayIndex(i, j - 1)]
                    )) * (1.0 / c);
            }
        }
        set_bnd(b, x);
    }
}

function diffusion(b, x, prevX, diffuse, timestep) {
    const a = timestep * diffuse * (N - 2) ** 2;
    lin_solve(b, x, prevX, a, 1 + 6 * a);
}

function project(velX, velY, bound1, bound2) {
    let j;
    let i;
    for (j = 1; j < N - 1; j++) {
        for (i = 1; i < N - 1; i++) {
            bound2[arrayIndex(i, j)] = -0.5 * (velX[arrayIndex(i + 1, j)] - velX[arrayIndex(i - 1, j)] + velY[arrayIndex(i, j + 1)] - velY[arrayIndex(i, j - 1)]) / N;
            bound1[arrayIndex(i, j)] = 0;
        }
    }

    set_bnd(0, bound2);
    set_bnd(0, bound1);
    lin_solve(0, bound1, bound2, 1, 6);

    for (j = 1; j < N - 1; j++) {
        for (i = 1; i < N - 1; i++) {
            velX[arrayIndex(i, j)] -= 0.5 * (bound1[arrayIndex(i + 1, j)] - bound1[arrayIndex(i - 1, j)]) * N;
            velY[arrayIndex(i, j)] -= 0.5 * (bound1[arrayIndex(i, j + 1)] - bound1[arrayIndex(i, j - 1)]) * N;
        }
    }
    set_bnd(1, velX);
    set_bnd(2, velY);
}

// Advect Function from https://github.com/CodingTrain/website/blob/main/CodingChallenges/CC_132_FluidSimulation/P5/fluid_utils.js;
function advect(b, d, d0, velX, velY, dt) {
    let i0;
    let i1;
    let j0;
    let j1;

    const dtx = dt * (N - 2);
    const dty = dt * (N - 2);

    let s0;
    let s1;
    let t0;
    let t1;

    let tmp1;
    let tmp2;
    let x;
    let y;

    const Nfloat = N - 2;
    let ifloat;
    let jfloat;
    let i;
    let j;

    for (j = 1, jfloat = 1; j < N - 1; j++, jfloat++) {
        for (i = 1, ifloat = 1; i < N - 1; i++, ifloat++) {
            tmp1 = dtx * velX[arrayIndex(i, j)];
            tmp2 = dty * velY[arrayIndex(i, j)];
            x = ifloat - tmp1;
            y = jfloat - tmp2;

            if (x < 0.5) {
                x = 0.5;
            }
            if (x > Nfloat + 0.5) {
                x = Nfloat + 0.5;
            }
            i0 = Math.floor(x);
            i1 = i0 + 1.0;
            if (y < 0.5) {
                y = 0.5;
            }
            if (y > Nfloat + 0.5) {
                y = Nfloat + 0.5;
            }
            j0 = Math.floor(y);
            j1 = j0 + 1.0;

            s1 = x - i0;
            s0 = 1.0 - s1;
            t1 = y - j0;
            t0 = 1.0 - t1;

            const i0i = parseInt(i0);
            const i1i = parseInt(i1);
            const j0i = parseInt(j0);
            const j1i = parseInt(j1);

            d[arrayIndex(i, j)] = s0 * (t0 * d0[arrayIndex(i0i, j0i)] + t1 * d0[arrayIndex(i0i, j1i)]) +
                s1 * (t0 * d0[arrayIndex(i1i, j0i)] + t1 * d0[arrayIndex(i1i, j1i)]);
        }
    }

    set_bnd(b, d);
}