export interface LifeState {
  width: number;
  height: number;
  cols: number;
  rows: number;
  cellSize: number;
  grid: Uint8Array;
  nextGrid: Uint8Array;
}

export function initLife(
  width: number,
  height: number,
  cellSize: number = 10,
): LifeState {
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);
  const size = cols * rows;

  const grid = new Uint8Array(size);
  // Randomize initial state
  for (let i = 0; i < size; i++) {
    grid[i] = Math.random() > 0.8 ? 1 : 0;
  }

  return {
    width,
    height,
    cols,
    rows,
    cellSize,
    grid,
    nextGrid: new Uint8Array(size),
  };
}

export function clearLife(state: LifeState) {
  state.grid.fill(0);
}

export function toggleCell(state: LifeState, x: number, y: number) {
  const { cols, rows, cellSize, grid } = state;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    const idx = col + row * cols;
    grid[idx] = 1; // Draw alive
  }
}

export function stepLife(state: LifeState) {
  const { cols, rows, grid, nextGrid } = state;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const idx = i + j * cols;
      let neighbors = 0;

      // Count neighbors (with wrap-around)
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) continue;

          const col = (i + x + cols) % cols;
          const row = (j + y + rows) % rows;
          neighbors += grid[col + row * cols];
        }
      }

      const cellState = grid[idx];
      if (cellState === 1 && (neighbors < 2 || neighbors > 3)) {
        nextGrid[idx] = 0;
      } else if (cellState === 0 && neighbors === 3) {
        nextGrid[idx] = 1;
      } else {
        nextGrid[idx] = cellState;
      }
    }
  }

  // Swap grids
  state.grid.set(nextGrid);
}
