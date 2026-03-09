import React, { useEffect, useRef, useState } from "react";
import ControlPanel from "../../components/ControlPanel";
import Slider from "../../components/Slider";
import Button from "../../components/Button";
import {
  initFluid,
  updateFluid,
  addDye,
  addVelocity,
  FluidState,
  FluidConfig,
} from "../../simulations/fluid/fluidEngine";
import { renderFluid } from "../../simulations/fluid/fluidRenderer";
import { useTheme } from "../../ThemeContext";

export default function Fluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<FluidState | null>(null);
  const animationRef = useRef<number>(0);
  const { theme } = useTheme();

  const [viscosity, setViscosity] = useState(0.0001);
  const [dyeIntensity, setDyeIntensity] = useState(100);

  const mouseRef = useRef({ isDown: false, x: 0, y: 0, px: 0, py: 0 });

  const resetSimulation = () => {
    if (canvasRef.current && containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
      // Use resolution 4 for performance
      stateRef.current = initFluid(clientWidth, clientHeight, 4);
    }
  };

  useEffect(() => {
    resetSimulation();

    const handleResize = () => {
      resetSimulation();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loop = () => {
      if (stateRef.current && canvasRef.current) {
        const config: FluidConfig = {
          viscosity,
          dyeIntensity,
          dt: 0.1,
          diff: 0.0001,
        };

        // Handle mouse input
        if (mouseRef.current.isDown) {
          const { x, y, px, py } = mouseRef.current;
          const dx = x - px;
          const dy = y - py;

          addDye(stateRef.current, x, y, dyeIntensity);
          addVelocity(stateRef.current, x, y, dx * 0.5, dy * 0.5);

          mouseRef.current.px = x;
          mouseRef.current.py = y;
        }

        updateFluid(stateRef.current, config);
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          const isRainbow = Math.abs(viscosity - 0.0007) < 0.00001 && dyeIntensity === 77;
          renderFluid(ctx, stateRef.current, theme, isRainbow);
        }
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [viscosity, dyeIntensity, theme]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { isDown: true, x, y, px: x, py: y };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!mouseRef.current.isDown) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
  };

  const isRainbow = Math.abs(viscosity - 0.0007) < 0.00001 && dyeIntensity === 77;

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 relative bg-zinc-100 dark:bg-black transition-colors duration-300" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
        <div className="absolute top-4 left-4 text-zinc-500 text-sm pointer-events-none">
          Drag to interact with fluid
        </div>
        {isRainbow && (
          <div className="absolute top-4 right-4 text-pink-500 font-bold animate-pulse pointer-events-none">
            Rainbow Flow Unlocked!
          </div>
        )}
      </div>
      <ControlPanel title="Fluid">
        <Slider
          label="Viscosity"
          value={viscosity}
          min={0}
          max={0.001}
          step={0.0001}
          onChange={setViscosity}
          formatValue={(v) => v.toFixed(4)}
        />
        <Slider
          label="Dye Intensity"
          value={dyeIntensity}
          min={10}
          max={300}
          step={1}
          onChange={setDyeIntensity}
        />
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            onClick={resetSimulation}
            variant="secondary"
            className="w-full"
          >
            Reset Simulation
          </Button>
        </div>
      </ControlPanel>
    </div>
  );
}
