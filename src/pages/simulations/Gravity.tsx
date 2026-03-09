import React, { useEffect, useRef, useState } from "react";
import ControlPanel from "../../components/ControlPanel";
import Slider from "../../components/Slider";
import Toggle from "../../components/Toggle";
import Button from "../../components/Button";
import {
  initGravity,
  updateGravity,
  spawnBody,
  spawnBlackHole,
  GravityState,
  GravityConfig,
} from "../../simulations/gravity/gravityEngine";
import { renderGravity } from "../../simulations/gravity/gravityRenderer";
import { useTheme } from "../../ThemeContext";

export default function Gravity() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GravityState | null>(null);
  const animationRef = useRef<number>(0);
  const { theme } = useTheme();

  const [G, setG] = useState(0.5);
  const [spawnMass, setSpawnMass] = useState(50);
  const [paused, setPaused] = useState(false);
  const [blackHoleUnlocked, setBlackHoleUnlocked] = useState(false);

  // Easter egg tracking
  const clickHistoryRef = useRef<{time: number, x: number, y: number}[]>([]);

  const resetSimulation = () => {
    if (canvasRef.current && containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
      stateRef.current = initGravity(clientWidth, clientHeight);
      setBlackHoleUnlocked(false);
    }
  };

  useEffect(() => {
    resetSimulation();

    const handleResize = () => {
      if (canvasRef.current && containerRef.current && stateRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
        stateRef.current.width = clientWidth;
        stateRef.current.height = clientHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loop = () => {
      if (stateRef.current && canvasRef.current) {
        const config: GravityConfig = { G, paused };

        updateGravity(stateRef.current, config);
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          renderGravity(ctx, stateRef.current, theme);
        }
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [G, paused, theme]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && stateRef.current) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const now = performance.now();
      const history = clickHistoryRef.current;
      history.push({ time: now, x, y });
      
      // Keep only last 3 clicks
      if (history.length > 3) history.shift();
      
      let isBlackHole = false;
      if (history.length === 3) {
        const timeDiff = history[2].time - history[0].time;
        const dist1 = Math.hypot(history[1].x - history[0].x, history[1].y - history[0].y);
        const dist2 = Math.hypot(history[2].x - history[1].x, history[2].y - history[1].y);
        
        // 3 clicks within 1 second, and very close to each other
        if (timeDiff < 1000 && dist1 < 20 && dist2 < 20) {
          isBlackHole = true;
          setBlackHoleUnlocked(true);
          clickHistoryRef.current = []; // reset
        }
      }

      if (isBlackHole) {
        spawnBlackHole(stateRef.current, x, y);
      } else {
        spawnBody(stateRef.current, x, y, spawnMass);
      }
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 relative bg-zinc-100 dark:bg-black transition-colors duration-300" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block cursor-crosshair"
          onClick={handleCanvasClick}
        />
        <div className="absolute top-4 left-4 text-zinc-500 text-sm pointer-events-none">
          Click to spawn bodies
        </div>
        {blackHoleUnlocked && (
          <div className="absolute top-4 right-4 text-purple-500 font-bold animate-pulse pointer-events-none">
            Supermassive Black Hole Spawned!
          </div>
        )}
      </div>
      <ControlPanel title="Gravity">
        <Slider
          label="Gravity Strength (G)"
          value={G}
          min={0.1}
          max={2.0}
          step={0.1}
          onChange={setG}
        />
        <Slider
          label="Spawn Mass"
          value={spawnMass}
          min={10}
          max={200}
          step={10}
          onChange={setSpawnMass}
        />
        <Toggle
          label="Pause Simulation"
          checked={paused}
          onChange={setPaused}
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
