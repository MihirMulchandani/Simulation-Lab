<div align="center">

<h1>Simulation Lab</h1>
<img width="1356" height="799" alt="Screenshot from 2026-03-09 16-45-40" src="https://github.com/user-attachments/assets/7e8b99cb-658c-4295-a30b-ff04d2dbdfda" />


</div>

Simulation Lab is an interactive browser playground built around a simple idea:

what happens when small rules run continuously?

Not a game.  
Not a visualization demo.

A laboratory.

A place where systems evolve in real time.

Particles swarm.  
Gravity organizes motion.  
Fluids diffuse and swirl.  
Cells live and die.

Everything runs directly in the browser.

No backend.  
No external computation.  
No hidden processing.

Just rules, iteration, and emergence.

---

## What it explores

Simulation Lab explores **emergent behavior**.

Many complex systems in nature arise from very small rules repeated thousands of times.

A particle follows velocity.  
A body follows gravity.  
A cell follows survival rules.

Individually the rules are trivial.

Together they produce patterns that feel almost alive.

The lab exists to observe those patterns.

Not as static diagrams,  
but as systems evolving in real time.

---

## Simulations

Simulation Lab currently includes four systems.

### Particle Simulation

A dynamic particle system where hundreds of particles move simultaneously.

Each particle maintains:

position  
velocity  
direction  

Particles respond to:

mouse interaction  
gravity toggle  
boundary collisions  

Small changes in parameters produce dramatically different swarm behavior.

---

### Gravity Simulation (N-Body)

Bodies interact through Newtonian gravity.

Each object attracts every other object in the system.

Users can spawn new bodies and observe:

orbital motion  
cluster formation  
system collapse  
chaotic interactions  

Sometimes the system stabilizes.

Sometimes it doesn’t.

That unpredictability is the point.

---

### Fluid Simulation

A lightweight Eulerian fluid simulation.

Users inject dye into a velocity field and watch it diffuse.

The simulation models:

velocity advection  
dye diffusion  
viscosity effects  

The result resembles colored ink dispersing through water.

Interaction is direct.

Drag the mouse.  
Watch the system respond.

---

### Conway’s Game of Life

A classic cellular automaton.

Cells exist on a grid and evolve through simple rules:

Underpopulation  
Survival  
Overpopulation  
Reproduction  

From these rules emerge structures like:

oscillators  
gliders  
spaceships  
self-sustaining systems  

Users can draw patterns and observe how generations evolve.

---

## Interaction model

Each simulation operates inside a controlled environment.

The interface provides tools to:

adjust system parameters  
inject forces or objects  
reset the simulation  
pause and resume time  

The user does not command outcomes.

The user defines conditions.

The system evolves.

---

## Hidden interactions

Some simulations include small hidden behaviors.

Unusual parameter combinations,  
specific interactions,  
or unexpected patterns

may trigger subtle variations in system behavior.

These are documented in **easterEggs.md**.

Hints exist.

The rest is left to exploration.

Examples include:

• **Golden Swarm Mode** — unlocked in the particle system  
• **Supermassive Black Hole** — hidden event in gravity simulation  
• **Rainbow Flow** — psychedelic fluid behavior  
• **Psychedelic Life** — visual mode in Game of Life

---

## System architecture

Simulation Lab separates **simulation logic** from **rendering logic**.

Each simulation consists of two layers.

**Engine**

Responsible for the mathematical model.

Handles:

state updates  
physics calculations  
time step integration  

**Renderer**

Responsible only for drawing the current state onto the canvas.

Uses optimized HTML5 Canvas operations for performance.

**React Component**

Bridges user input, simulation parameters, and the animation loop.

The animation loop runs through `requestAnimationFrame` to ensure smooth rendering.

This architecture ensures simulation complexity does not leak into UI logic.

---

## Technical stack

Simulation Lab is built as a modern frontend application.

React (Vite environment)  
TypeScript  
React Router  
Tailwind CSS  
Lucide Icons  
HTML5 Canvas API  

The project intentionally keeps dependencies minimal.

Rendering happens through the Canvas API rather than DOM manipulation.

---

## Design principles

Simulation Lab follows a few constraints.

Interfaces should stay quiet.

Controls should remain minimal.

Visual feedback should come from the system itself.

The simulation is the focus.

Not the UI around it.

If the interface distracts from the behavior of the system,  
it has failed.

---

## Project structure

```

src/
├── components/         # Shared UI components
├── pages/              # Route-level pages
├── simulations/        # Simulation engines and renderers
│   ├── particles/
│   ├── gravity/
│   ├── fluid/
│   └── life/
├── App.tsx             # Application routing
├── index.css           # Global styles
└── main.tsx            # Application entry point

```

Each simulation module contains:

engine logic  
rendering logic  
configuration structures  

No simulation logic exists inside UI components.

---

## How to run locally

1. Install **Node.js** (v18 or higher recommended)

2. Clone the repository

3. Install dependencies

```

npm install

```

4. Start the development server

```

npm run dev

```

5. Open your browser

```

[http://localhost:5173](http://localhost:5173)

```

The lab will load and simulations will be available immediately.

---

## Version

1.0.0

---

## Future direction

Additional simulations may include:

boids flocking systems  
wave propagation  
sand simulation  
reaction diffusion systems  
chaotic attractors  

The architecture allows new systems to be added without altering the core interface.

---

<p align="center">

<a href="https://simulation-lab.vercel.app/">
<img width="195" height="51" alt="Screenshot from 2026-03-09 16-45-58" src="https://github.com/user-attachments/assets/d22bfa1f-f507-4e59-897a-0db9037541ed" />

</a>

</p>

© Mihir Mulchandani
