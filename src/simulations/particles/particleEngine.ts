export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export interface ParticleState {
  particles: Particle[];
  width: number;
  height: number;
}

export interface ParticleConfig {
  count: number;
  gravity: boolean;
  mouseInteraction: boolean;
  mouseX: number | null;
  mouseY: number | null;
}

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#059669"]; // Emeralds
const GOLDEN_COLORS = ["#fbbf24", "#f59e0b", "#d97706", "#fcd34d"]; // Golds

export function initParticles(
  width: number,
  height: number,
  count: number,
): ParticleState {
  const particles: Particle[] = [];
  const isEasterEgg = count === 777;
  const colorsToUse = isEasterEgg ? GOLDEN_COLORS : COLORS;
  
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isEasterEgg ? 10 : 4),
      vy: (Math.random() - 0.5) * (isEasterEgg ? 10 : 4),
      radius: Math.random() * 2 + (isEasterEgg ? 2.5 : 1.5),
      color: colorsToUse[Math.floor(Math.random() * colorsToUse.length)],
    });
  }
  return { particles, width, height };
}

export function updateParticles(
  state: ParticleState,
  config: ParticleConfig,
  dt: number,
) {
  const { particles, width, height } = state;
  const { gravity, mouseInteraction, mouseX, mouseY } = config;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    if (gravity) {
      p.vy += 0.15; // Gravity acceleration
    }

    if (mouseInteraction && mouseX !== null && mouseY !== null) {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 20000) {
        const dist = Math.sqrt(distSq);
        const force = (20000 - distSq) / 20000;
        // Repulsion
        p.vx -= (dx / dist) * force * 0.5;
        p.vy -= (dy / dist) * force * 0.5;
      }
    }

    p.x += p.vx;
    p.y += p.vy;

    // Bounce off walls
    if (p.x < p.radius) {
      p.x = p.radius;
      p.vx *= -0.8;
    } else if (p.x > width - p.radius) {
      p.x = width - p.radius;
      p.vx *= -0.8;
    }

    if (p.y < p.radius) {
      p.y = p.radius;
      p.vy *= -0.8;
    } else if (p.y > height - p.radius) {
      p.y = height - p.radius;
      p.vy *= -0.8;
      // Friction when rolling on floor
      if (gravity) {
        p.vx *= 0.99;
      }
    }
  }
}
