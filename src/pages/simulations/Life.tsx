import React, { useEffect, useRef, useState } from "react";
import ControlPanel from "../../components/ControlPanel";
import Slider from "../../components/Slider";
import Toggle from "../../components/Toggle";
import Button from "../../components/Button";
import {
  initLife,
  stepLife,
  clearLife,
  toggleCell,
  LifeState,
} from "../../simulations/life/lifeEngine";
import { renderLife } from "../../simulations/life/lifeRenderer";
import { useTheme } from "../../ThemeContext";

export default function Life() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<LifeState | null>(null);
  const animationRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const { theme } = useTheme();

  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(15); // updates per second
  const [cellSize, setCellSize] = useState(10);

  const isDrawingRef = useRef(false);

  const isRainbow = speed === 60 && cellSize === 4;

  const resetSimulation = () => {
    if (canvasRef.current && containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
      stateRef.current = initLife(clientWidth, clientHeight, cellSize);
      renderLife(canvasRef.current.getContext("2d")!, stateRef.current, theme, isRainbow);
    }
  };

  const handleClear = () => {
    if (stateRef.current && canvasRef.current) {
      clearLife(stateRef.current);
      renderLife(canvasRef.current.getContext("2d")!, stateRef.current, theme, isRainbow);
      setRunning(false);
    }
  };

  const handleStep = () => {
    if (stateRef.current && canvasRef.current) {
      stepLife(stateRef.current);
      renderLife(canvasRef.current.getContext("2d")!, stateRef.current, theme, isRainbow);
    }
  };

  useEffect(() => {
    resetSimulation();

    const handleResize = () => {
      resetSimulation();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cellSize]);

  useEffect(() => {
    const loop = (time: number) => {
      if (running && stateRef.current && canvasRef.current) {
        const updateInterval = 1000 / speed;
        if (time - lastUpdateRef.current > updateInterval) {
          stepLife(stateRef.current);
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            renderLife(ctx, stateRef.current, theme, isRainbow);
          }
          lastUpdateRef.current = time;
        }
      } else if (!running && stateRef.current && canvasRef.current && isRainbow) {
        // Still render if paused but rainbow is active to animate colors
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          renderLife(ctx, stateRef.current, theme, isRainbow);
        }
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [running, speed, theme, isRainbow]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    handleDraw(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawingRef.current) {
      handleDraw(e);
    }
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handleDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && stateRef.current && canvasRef.current) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      toggleCell(stateRef.current, x, y);
      renderLife(canvasRef.current.getContext("2d")!, stateRef.current, theme, isRainbow);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 relative bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block touch-none cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        <div className="absolute top-4 left-4 text-zinc-500 text-sm pointer-events-none">
          Draw cells to bring them to life
        </div>
        {isRainbow && (
          <div className="absolute top-4 right-4 text-pink-500 font-bold animate-pulse pointer-events-none">
            Psychedelic Mode Unlocked!
          </div>
        )}
      </div>
      <ControlPanel title="Game of Life">
        <Toggle label="Running" checked={running} onChange={setRunning} />
        <Slider
          label="Speed (Updates/s)"
          value={speed}
          min={1}
          max={60}
          step={1}
          onChange={setSpeed}
        />
        <Slider
          label="Cell Size"
          value={cellSize}
          min={4}
          max={40}
          step={2}
          onChange={setCellSize}
        />

        <div className="flex flex-col gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button onClick={handleStep} variant="secondary" disabled={running}>
            Step Forward
          </Button>
          <Button onClick={handleClear} variant="danger">
            Clear Grid
          </Button>
          <Button onClick={resetSimulation} variant="secondary">
            Randomize
          </Button>
        </div>
      </ControlPanel>
    </div>
  );
}
