# Simulation Lab

Simulation Lab is an interactive, browser-based playground where users can explore interactive physics and algorithm simulations. It is built with a focus on performance, clean architecture, and modern UI design.

## Features

*   **Particle Simulation:** A dynamic particle system featuring velocity, bouncing, optional gravity, and mouse repulsion.
*   **Gravity Simulation (N-Body):** Simulates gravitational attraction between bodies, allowing users to spawn new bodies and observe orbital patterns.
*   **Fluid Simulation:** A lightweight, interactive Eulerian fluid simulation using dye diffusion and velocity fields.
*   **Game of Life:** Conway's cellular automata. Draw cells and watch generations evolve over time.

## Technology Stack

*   **Framework:** React (via Vite)
*   **Routing:** React Router
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **Rendering:** HTML5 Canvas API

*Note: The project was adapted to use Vite and React Router instead of Next.js to fit the provided development environment, while maintaining the exact requested architecture, routing structure, and functionality.*

## How Simulations Work

The simulations are built using a clean architecture that separates state management (engine) from rendering logic (renderer).

1.  **Engine (`*Engine.ts`):** Contains the mathematical models, physics calculations, and state updates. It exposes an `update` function that takes the current state, configuration parameters, and a time delta to compute the next state.
2.  **Renderer (`*Renderer.ts`):** Responsible solely for drawing the current state onto the HTML5 Canvas. It uses optimized canvas operations (like `globalCompositeOperation` for glowing effects or `ImageData` for pixel-perfect fluid rendering).
3.  **Component (`*.tsx`):** The React component manages the `requestAnimationFrame` loop, handles user input (mouse events, control panel changes), and bridges the Engine and Renderer.

This separation ensures that complex simulation logic does not clutter React components and allows the animation loops to run independently of React state updates for maximum performance.

## Project Structure

```
src/
├── components/         # Reusable UI components (Header, Sliders, Buttons)
├── pages/              # Route components (Home, Simulation pages)
├── simulations/        # Core simulation logic
│   ├── fluid/          # Fluid simulation engine and renderer
│   ├── gravity/        # N-Body gravity simulation engine and renderer
│   ├── life/           # Game of Life engine and renderer
│   └── particles/      # Particle system engine and renderer
├── App.tsx             # Main application component and routing setup
├── index.css           # Global styles and Tailwind configuration
└── main.tsx            # Application entry point
```

## How to Run Locally

1.  **Install Node.js:** Ensure you have Node.js installed (v18 or higher recommended).
2.  **Clone the repository:** Clone this project to your local machine.
3.  **Install dependencies:** Run `npm install` in the project root.
4.  **Start the development server:** Run `npm run dev`.
5.  **Open in browser:** Navigate to `http://localhost:5173` (or the port specified in your terminal).
