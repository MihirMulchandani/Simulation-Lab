import { FluidState } from "./fluidEngine";

export function renderFluid(ctx: CanvasRenderingContext2D, state: FluidState, theme: 'light' | 'dark', isRainbow: boolean) {
  const { cols, rows, density } = state;

  ctx.fillStyle = theme === 'dark' ? "black" : "#f4f4f5";
  ctx.fillRect(0, 0, state.width, state.height);

  const imgData = ctx.createImageData(cols, rows);
  const data = imgData.data;

  const time = performance.now() * 0.001;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const idx = i + j * cols;
      const d = density[idx];

      const pxIdx = (i + j * cols) * 4;

      if (d > 0.1) {
        if (isRainbow) {
          // Rainbow color mapping
          const hue = (d * 10 + time * 50) % 360;
          // Simple HSL to RGB conversion for the rainbow effect
          const c = d * 255;
          const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
          const m = 0;
          let r = 0, g = 0, b = 0;
          if (hue >= 0 && hue < 60) { r = c; g = x; b = 0; }
          else if (hue >= 60 && hue < 120) { r = x; g = c; b = 0; }
          else if (hue >= 120 && hue < 180) { r = 0; g = c; b = x; }
          else if (hue >= 180 && hue < 240) { r = 0; g = x; b = c; }
          else if (hue >= 240 && hue < 300) { r = x; g = 0; b = c; }
          else { r = c; g = 0; b = x; }

          data[pxIdx] = Math.min(255, r + m);
          data[pxIdx + 1] = Math.min(255, g + m);
          data[pxIdx + 2] = Math.min(255, b + m);
        } else {
          // Default Color mapping (blue-ish)
          if (theme === 'dark') {
            data[pxIdx] = Math.min(255, d * 50);
            data[pxIdx + 1] = Math.min(255, d * 150);
            data[pxIdx + 2] = Math.min(255, d * 255);
          } else {
            // In light mode, fluid should be darker blue
            data[pxIdx] = Math.max(0, 244 - d * 200);
            data[pxIdx + 1] = Math.max(0, 244 - d * 100);
            data[pxIdx + 2] = Math.max(0, 245 - d * 50);
          }
        }
        data[pxIdx + 3] = theme === 'dark' || isRainbow ? 255 : Math.min(255, d * 255);
      } else {
        if (theme === 'dark') {
          data[pxIdx] = 0; data[pxIdx+1] = 0; data[pxIdx+2] = 0; data[pxIdx+3] = 255;
        } else {
          data[pxIdx] = 244; data[pxIdx+1] = 244; data[pxIdx+2] = 245; data[pxIdx+3] = 255;
        }
      }
    }
  }

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = cols;
  tempCanvas.height = rows;
  const tempCtx = tempCanvas.getContext("2d");
  if (tempCtx) {
    tempCtx.putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(tempCanvas, 0, 0, state.width, state.height);
  }
}
