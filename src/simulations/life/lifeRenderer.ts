import { LifeState } from "./lifeEngine";

export function renderLife(ctx: CanvasRenderingContext2D, state: LifeState, theme: 'light' | 'dark', isRainbow: boolean) {
  const { cols, rows, cellSize, grid, width, height } = state;

  ctx.fillStyle = theme === 'dark' ? "#09090b" : "#f4f4f5"; // zinc-950 or zinc-100
  ctx.fillRect(0, 0, width, height);

  const time = performance.now() * 0.001;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i + j * cols] === 1) {
        if (isRainbow) {
          const hue = ((i + j) * 5 + time * 100) % 360;
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        } else {
          ctx.fillStyle = theme === 'dark' ? "#fbbf24" : "#d97706"; // amber-400 or amber-600
        }
        ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }
}
