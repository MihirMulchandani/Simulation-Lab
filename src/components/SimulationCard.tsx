import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface SimulationCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color: "emerald" | "violet" | "blue" | "amber";
}

export default function SimulationCard({
  title,
  description,
  icon,
  href,
  color,
}: SimulationCardProps) {
  const colorStyles = {
    emerald: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    violet: "hover:border-violet-500/50 hover:shadow-violet-500/10",
    blue: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    amber: "hover:border-amber-500/50 hover:shadow-amber-500/10",
  };

  return (
    <Link
      to={href}
      className={`group relative flex flex-col p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-xl ${colorStyles[color]}`}
    >
      <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl inline-flex w-fit border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{description}</p>
    </Link>
  );
}
