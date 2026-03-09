import { ParticleState } from "./particleEngine";

export function renderParticles(
  ctx: CanvasRenderingContext2D,
  state: ParticleState,
  theme: 'light' | 'dark'
) {
  ctx.clearRect(0, 0, state.width, state.height);

  const { particles } = state;

  // Use lighter composite operation for glowing effect in dark mode
  ctx.globalCompositeOperation = theme === 'dark' ? "screen" : "source-over";

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}
