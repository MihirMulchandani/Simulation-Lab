import React, { useEffect, useRef, useState } from "react";
import ControlPanel from "../../components/ControlPanel";
import Slider from "../../components/Slider";
import Toggle from "../../components/Toggle";
import Button from "../../components/Button";
import {
  initParticles,
  updateParticles,
  ParticleState,
  ParticleConfig,
} from "../../simulations/particles/particleEngine";
import { renderParticles } from "../../simulations/particles/particleRenderer";
import { useTheme } from "../../ThemeContext";

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<ParticleState | null>(null);
  const animationRef = useRef<number>(0);
  const { theme } = useTheme();

  const [count, setCount] = useState(500);
  const [gravity, setGravity] = useState(false);
  const [mouseInteraction, setMouseInteraction] = useState(true);

  const mouseRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  const resetSimulation = () => {
    if (canvasRef.current && containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
      stateRef.current = initParticles(clientWidth, clientHeight, count);
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
  }, [count]); // Re-init when count changes

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (stateRef.current && canvasRef.current) {
        const config: ParticleConfig = {
          count,
          gravity,
          mouseInteraction,
          mouseX: mouseRef.current.x,
          mouseY: mouseRef.current.y,
        };

        updateParticles(stateRef.current, config, dt);
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          renderParticles(ctx, stateRef.current, theme);
        }
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [count, gravity, mouseInteraction, theme]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: null, y: null };
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 relative bg-zinc-100 dark:bg-black transition-colors duration-300" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        {count === 777 && (
          <div className="absolute top-4 right-4 text-amber-500 font-bold animate-pulse pointer-events-none">
            Golden Swarm Unlocked!
          </div>
        )}
      </div>
      <ControlPanel title="Particle">
        <Slider
          label="Particle Count"
          value={count}
          min={100}
          max={2000}
          step={1}
          onChange={setCount}
        />
        <Toggle label="Gravity" checked={gravity} onChange={setGravity} />
        <Toggle
          label="Mouse Repulsion"
          checked={mouseInteraction}
          onChange={setMouseInteraction}
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
