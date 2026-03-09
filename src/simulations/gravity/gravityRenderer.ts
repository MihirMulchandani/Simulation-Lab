import { GravityState } from "./gravityEngine";

export function renderGravity(
  ctx: CanvasRenderingContext2D,
  state: GravityState,
  theme: 'light' | 'dark'
) {
  // Trail effect
  ctx.fillStyle = theme === 'dark' ? "rgba(0, 0, 0, 0.15)" : "rgba(244, 244, 245, 0.15)";
  ctx.fillRect(0, 0, state.width, state.height);

  const { bodies } = state;

  ctx.globalCompositeOperation = theme === 'dark' ? "screen" : "source-over";

  for (let i = 0; i < bodies.length; i++) {
    const b = bodies[i];

    if (b.color === "#000000") {
      // Render Black Hole
      ctx.globalCompositeOperation = "source-over";
      const gradient = ctx.createRadialGradient(
        b.x, b.y, b.radius, b.x, b.y, b.radius * 3
      );
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(0.5, "rgba(88,28,135,0.5)"); // Purple glow
      gradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.fill();
      
      ctx.globalCompositeOperation = theme === 'dark' ? "screen" : "source-over";
      continue;
    }

    // Glow
    const gradient = ctx.createRadialGradient(
      b.x,
      b.y,
      0,
      b.x,
      b.y,
      b.radius * 2,
    );
    gradient.addColorStop(0, b.color);
    gradient.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Core
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = theme === 'dark' ? "#fff" : b.color;
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}
