export interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  isStatic?: boolean;
}

export interface GravityState {
  bodies: Body[];
  width: number;
  height: number;
}

export interface GravityConfig {
  G: number;
  paused: boolean;
}

const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed"]; // Violets

export function initGravity(width: number, height: number): GravityState {
  const bodies: Body[] = [];

  // Central massive body
  bodies.push({
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    mass: 5000,
    radius: 20,
    color: "#fcd34d", // Sun-like
    isStatic: true,
  });

  // Some orbiting bodies
  for (let i = 0; i < 5; i++) {
    const dist = 100 + Math.random() * 200;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.sqrt((0.5 * 5000) / dist); // Orbital velocity approx

    bodies.push({
      x: width / 2 + Math.cos(angle) * dist,
      y: height / 2 + Math.sin(angle) * dist,
      vx: -Math.sin(angle) * speed,
      vy: Math.cos(angle) * speed,
      mass: Math.random() * 50 + 10,
      radius: Math.random() * 4 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  return { bodies, width, height };
}

export function updateGravity(state: GravityState, config: GravityConfig) {
  if (config.paused) return;

  const { bodies } = state;
  const { G } = config;

  // Calculate forces
  for (let i = 0; i < bodies.length; i++) {
    const b1 = bodies[i];
    if (b1.isStatic) continue;

    for (let j = 0; j < bodies.length; j++) {
      if (i === j) continue;
      const b2 = bodies[j];

      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distSq = dx * dx + dy * dy;

      // Prevent extreme forces at close range
      if (distSq < 100) continue;

      const dist = Math.sqrt(distSq);
      const force = (G * b1.mass * b2.mass) / distSq;

      const ax = (force * dx) / dist / b1.mass;
      const ay = (force * dy) / dist / b1.mass;

      b1.vx += ax;
      b1.vy += ay;
    }
  }

  // Apply velocities
  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];
    if (!b.isStatic) {
      b.x += b.vx;
      b.y += b.vy;
    }
  }
}

export function spawnBlackHole(
  state: GravityState,
  x: number,
  y: number
) {
  state.bodies.push({
    x,
    y,
    vx: 0,
    vy: 0,
    mass: 10000,
    radius: 15,
    color: "#000000",
    isStatic: true,
  });
}

export function spawnBody(
  state: GravityState,
  x: number,
  y: number,
  mass: number,
) {
  // Give it a random orbital velocity relative to center
  const dx = x - state.width / 2;
  const dy = y - state.height / 2;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const speed = Math.sqrt((0.5 * 5000) / dist);
  const angle = Math.atan2(dy, dx);

  state.bodies.push({
    x,
    y,
    vx: -Math.sin(angle) * speed,
    vy: Math.cos(angle) * speed,
    mass,
    radius: Math.max(2, Math.sqrt(mass)),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  });
}
