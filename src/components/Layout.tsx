import { Calendar, LayoutDashboard, Clock, History, Dumbbell, Dices, Timer } from 'lucide-react';
import type { View } from '../types';

interface Props {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { view: View; label: string; icon: typeof Calendar }[] = [
  { view: 'plan', label: 'Plan', icon: Calendar },
  { view: 'today', label: "Aujourd'hui", icon: Clock },
  { view: 'dashboard', label: 'Stats', icon: LayoutDashboard },
  { view: 'history', label: 'Historique', icon: History },
  { view: 'wod', label: 'WOD', icon: Dices },
  { view: 'timer', label: 'Timer', icon: Timer },
];

export default function Layout({ currentView, onNavigate, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3">
        <Dumbbell className="w-7 h-7 text-brand-orange" />
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-brand-orange">Hyrox</span>
          <span className="text-white">Fit</span>{' '}
          <span className="text-gray-400 font-normal">Planner</span>
        </h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="bg-gray-900 border-t border-gray-800 flex justify-around py-2 md:py-3">
        {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-lg transition-colors ${
              currentView === view
                ? 'text-brand-orange'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
