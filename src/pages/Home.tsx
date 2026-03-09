import SimulationCard from "../components/SimulationCard";
import { Sparkles, Orbit, Droplets, Grid } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
          Simulation Lab
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Interactive Physics and Algorithm Simulations in the Browser
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimulationCard
          title="Particle Simulation"
          description="A dynamic particle system with velocity, bouncing, gravity, and mouse interaction."
          icon={<Sparkles className="w-8 h-8 text-emerald-400" />}
          href="/simulations/particles"
          color="emerald"
        />
        <SimulationCard
          title="Gravity Simulation"
          description="N-Body simulation showing gravitational attraction and orbital patterns."
          icon={<Orbit className="w-8 h-8 text-violet-400" />}
          href="/simulations/gravity"
          color="violet"
        />
        <SimulationCard
          title="Fluid Simulation"
          description="Lightweight interactive fluid simulation using dye diffusion and velocity fields."
          icon={<Droplets className="w-8 h-8 text-blue-400" />}
          href="/simulations/fluid"
          color="blue"
        />
        <SimulationCard
          title="Game of Life"
          description="Conway's cellular automata. Draw cells and watch generations evolve."
          icon={<Grid className="w-8 h-8 text-amber-400" />}
          href="/simulations/life"
          color="amber"
        />
      </div>
    </div>
  );
}
