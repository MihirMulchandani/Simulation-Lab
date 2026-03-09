import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Particles from "./pages/simulations/Particles";
import Gravity from "./pages/simulations/Gravity";
import Fluid from "./pages/simulations/Fluid";
import Life from "./pages/simulations/Life";
import Header from "./components/Header";
import { ThemeProvider } from "./ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans flex flex-col transition-colors duration-300">
          <Header />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/simulations/particles" element={<Particles />} />
              <Route path="/simulations/gravity" element={<Gravity />} />
              <Route path="/simulations/fluid" element={<Fluid />} />
              <Route path="/simulations/life" element={<Life />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}
