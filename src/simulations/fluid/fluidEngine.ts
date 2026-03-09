// A simplified Eulerian fluid simulation (grid-based)
export interface FluidState {
  width: number;
  height: number;
  cols: number;
  rows: number;
  resolution: number;
  density: Float32Array;
  density_prev: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  vx_prev: Float32Array;
  vy_prev: Float32Array;
}

export interface FluidConfig {
  viscosity: number;
  dyeIntensity: number;
  dt: number;
  diff: number; // diffusion
}

const ITER = 4;

function IX(x: number, y: number, cols: number) {
  return x + y * cols;
}

export function initFluid(
  width: number,
  height: number,
  resolution: number = 4,
): FluidState {
  const cols = Math.floor(width / resolution);
  const rows = Math.floor(height / resolution);
  const size = cols * rows;

  return {
    width,
    height,
    cols,
    rows,
    resolution,
    density: new Float32Array(size),
    density_prev: new Float32Array(size),
    vx: new Float32Array(size),
    vy: new Float32Array(size),
    vx_prev: new Float32Array(size),
    vy_prev: new Float32Array(size),
  };
}

function set_bnd(b: number, x: Float32Array, cols: number, rows: number) {
  for (let i = 1; i < cols - 1; i++) {
    x[IX(i, 0, cols)] = b === 2 ? -x[IX(i, 1, cols)] : x[IX(i, 1, cols)];
    x[IX(i, rows - 1, cols)] =
      b === 2 ? -x[IX(i, rows - 2, cols)] : x[IX(i, rows - 2, cols)];
  }
  for (let j = 1; j < rows - 1; j++) {
    x[IX(0, j, cols)] = b === 1 ? -x[IX(1, j, cols)] : x[IX(1, j, cols)];
    x[IX(cols - 1, j, cols)] =
      b === 1 ? -x[IX(cols - 2, j, cols)] : x[IX(cols - 2, j, cols)];
  }
  x[IX(0, 0, cols)] = 0.5 * (x[IX(1, 0, cols)] + x[IX(0, 1, cols)]);
  x[IX(0, rows - 1, cols)] =
    0.5 * (x[IX(1, rows - 1, cols)] + x[IX(0, rows - 2, cols)]);
  x[IX(cols - 1, 0, cols)] =
    0.5 * (x[IX(cols - 2, 0, cols)] + x[IX(cols - 1, 1, cols)]);
  x[IX(cols - 1, rows - 1, cols)] =
    0.5 * (x[IX(cols - 2, rows - 1, cols)] + x[IX(cols - 1, rows - 2, cols)]);
}

function lin_solve(
  b: number,
  x: Float32Array,
  x0: Float32Array,
  a: number,
  c: number,
  cols: number,
  rows: number,
) {
  const cRecip = 1.0 / c;
  for (let k = 0; k < ITER; k++) {
    for (let j = 1; j < rows - 1; j++) {
      for (let i = 1; i < cols - 1; i++) {
        x[IX(i, j, cols)] =
          (x0[IX(i, j, cols)] +
            a *
              (x[IX(i + 1, j, cols)] +
                x[IX(i - 1, j, cols)] +
                x[IX(i, j + 1, cols)] +
                x[IX(i, j - 1, cols)])) *
          cRecip;
      }
    }
    set_bnd(b, x, cols, rows);
  }
}

function diffuse(
  b: number,
  x: Float32Array,
  x0: Float32Array,
  diff: number,
  dt: number,
  cols: number,
  rows: number,
) {
  const a = dt * diff * (cols - 2) * (rows - 2);
  lin_solve(b, x, x0, a, 1 + 4 * a, cols, rows);
}

function advect(
  b: number,
  d: Float32Array,
  d0: Float32Array,
  u: Float32Array,
  v: Float32Array,
  dt: number,
  cols: number,
  rows: number,
) {
  let i0, j0, i1, j1;
  let x, y, s0, t0, s1, t1;
  let dt0 = dt * Math.max(cols, rows);

  for (let j = 1; j < rows - 1; j++) {
    for (let i = 1; i < cols - 1; i++) {
      x = i - dt0 * u[IX(i, j, cols)];
      y = j - dt0 * v[IX(i, j, cols)];

      if (x < 0.5) x = 0.5;
      if (x > cols + 0.5) x = cols + 0.5;
      i0 = Math.floor(x);
      i1 = i0 + 1;

      if (y < 0.5) y = 0.5;
      if (y > rows + 0.5) y = rows + 0.5;
      j0 = Math.floor(y);
      j1 = j0 + 1;

      s1 = x - i0;
      s0 = 1.0 - s1;
      t1 = y - j0;
      t0 = 1.0 - t1;

      let i0i = Math.floor(i0);
      let i1i = Math.floor(i1);
      let j0i = Math.floor(j0);
      let j1i = Math.floor(j1);

      // Safe bounds
      if (i0i < 0) i0i = 0;
      if (i0i >= cols) i0i = cols - 1;
      if (i1i < 0) i1i = 0;
      if (i1i >= cols) i1i = cols - 1;
      if (j0i < 0) j0i = 0;
      if (j0i >= rows) j0i = rows - 1;
      if (j1i < 0) j1i = 0;
      if (j1i >= rows) j1i = rows - 1;

      d[IX(i, j, cols)] =
        s0 * (t0 * d0[IX(i0i, j0i, cols)] + t1 * d0[IX(i0i, j1i, cols)]) +
        s1 * (t0 * d0[IX(i1i, j0i, cols)] + t1 * d0[IX(i1i, j1i, cols)]);
    }
  }
  set_bnd(b, d, cols, rows);
}

function project(
  u: Float32Array,
  v: Float32Array,
  p: Float32Array,
  div: Float32Array,
  cols: number,
  rows: number,
) {
  for (let j = 1; j < rows - 1; j++) {
    for (let i = 1; i < cols - 1; i++) {
      div[IX(i, j, cols)] =
        (-0.5 *
          (u[IX(i + 1, j, cols)] -
            u[IX(i - 1, j, cols)] +
            v[IX(i, j + 1, cols)] -
            v[IX(i, j - 1, cols)])) /
        Math.max(cols, rows);
      p[IX(i, j, cols)] = 0;
    }
  }
  set_bnd(0, div, cols, rows);
  set_bnd(0, p, cols, rows);
  lin_solve(0, p, div, 1, 4, cols, rows);

  for (let j = 1; j < rows - 1; j++) {
    for (let i = 1; i < cols - 1; i++) {
      u[IX(i, j, cols)] -=
        0.5 *
        (p[IX(i + 1, j, cols)] - p[IX(i - 1, j, cols)]) *
        Math.max(cols, rows);
      v[IX(i, j, cols)] -=
        0.5 *
        (p[IX(i, j + 1, cols)] - p[IX(i, j - 1, cols)]) *
        Math.max(cols, rows);
    }
  }
  set_bnd(1, u, cols, rows);
  set_bnd(2, v, cols, rows);
}

export function updateFluid(state: FluidState, config: FluidConfig) {
  const { cols, rows, vx, vy, vx_prev, vy_prev, density, density_prev } = state;
  const { dt, viscosity, diff } = config;

  // Velocity step
  diffuse(1, vx_prev, vx, viscosity, dt, cols, rows);
  diffuse(2, vy_prev, vy, viscosity, dt, cols, rows);

  project(vx_prev, vy_prev, vx, vy, cols, rows);

  advect(1, vx, vx_prev, vx_prev, vy_prev, dt, cols, rows);
  advect(2, vy, vy_prev, vx_prev, vy_prev, dt, cols, rows);

  project(vx, vy, vx_prev, vy_prev, cols, rows);

  // Density step
  diffuse(0, density_prev, density, diff, dt, cols, rows);
  advect(0, density, density_prev, vx, vy, dt, cols, rows);

  // Decay density slightly
  for (let i = 0; i < density.length; i++) {
    density[i] *= 0.99;
  }
}

export function addDye(
  state: FluidState,
  x: number,
  y: number,
  amount: number,
) {
  const { cols, rows, resolution, density } = state;
  const gridX = Math.floor(x / resolution);
  const gridY = Math.floor(y / resolution);

  const radius = 2;
  for (let i = -radius; i <= radius; i++) {
    for (let j = -radius; j <= radius; j++) {
      const cx = gridX + i;
      const cy = gridY + j;
      if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
        density[IX(cx, cy, cols)] += amount;
      }
    }
  }
}

export function addVelocity(
  state: FluidState,
  x: number,
  y: number,
  amountX: number,
  amountY: number,
) {
  const { cols, rows, resolution, vx, vy } = state;
  const gridX = Math.floor(x / resolution);
  const gridY = Math.floor(y / resolution);

  const radius = 2;
  for (let i = -radius; i <= radius; i++) {
    for (let j = -radius; j <= radius; j++) {
      const cx = gridX + i;
      const cy = gridY + j;
      if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
        vx[IX(cx, cy, cols)] += amountX;
        vy[IX(cx, cy, cols)] += amountY;
      }
    }
  }
}
