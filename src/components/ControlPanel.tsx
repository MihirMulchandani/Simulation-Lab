import { ReactNode } from "react";

interface ControlPanelProps {
  title: string;
  children: ReactNode;
}

export default function ControlPanel({ title, children }: ControlPanelProps) {
  return (
    <div className="w-80 bg-zinc-50 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-6 overflow-y-auto h-full shrink-0 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title} Controls</h2>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
