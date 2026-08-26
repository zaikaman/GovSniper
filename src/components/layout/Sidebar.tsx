import React from 'react';
import { 
  Radar, 
  Crosshair, 
  PenTool, 
  Mail, 
  History,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import type { NavView } from '@/types';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  unreadEmailCount?: number;
  hasActiveTender?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  unreadEmailCount = 0,
  hasActiveTender = false,
}) => {
  const navItems = [
    {
      id: 'radar' as NavView,
      label: 'Radar Discovery',
      sublabel: 'Live Opportunity Feed',
      icon: Radar,
      badge: null,
      badgeColor: 'bg-cyber-cyan/10 text-cyber-cyan',
    },
    {
      id: 'warroom' as NavView,
      label: 'Tender War Room',
      sublabel: 'Compliance & Win Scoring',
      icon: Crosshair,
      badge: hasActiveTender ? 'ACTIVE' : null,
      badgeColor: 'bg-cyber-emerald/10 text-cyber-emerald border-cyber-emerald/30',
    },
    {
      id: 'studio' as NavView,
      label: 'Bid Studio',
      sublabel: 'Collaborative Proposal Editor',
      icon: PenTool,
      badge: null,
      badgeColor: '',
    },
    {
      id: 'inboxes' as NavView,
      label: 'AgentMail Hub',
      sublabel: 'Autonomous Inbound Inboxes',
      icon: Mail,
      badge: unreadEmailCount > 0 ? `${unreadEmailCount} NEW` : null,
      badgeColor: 'bg-cyber-amber/10 text-cyber-amber border-cyber-amber/30',
    },
    {
      id: 'audit' as NavView,
      label: 'Audit Trace',
      sublabel: 'Immutable Chronological Log',
      icon: History,
      badge: null,
      badgeColor: '',
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-cyber-panel/80 backdrop-blur-md border-r border-cyber-border min-h-[calc(100vh-61px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation Sections */}
        <div>
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
            Operations Matrix
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full group relative flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-cyber-card border border-cyber-cyan/40 text-white shadow-cyan-glow'
                      : 'hover:bg-cyber-surface/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-cyber-cyan/10 text-cyber-cyan'
                          : 'bg-cyber-surface text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive && item.id === 'radar' ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold tracking-wide ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {item.sublabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-cyber-cyan" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* System Status Footer Box */}
      <div className="p-3 rounded-xl bg-cyber-bg/70 border border-cyber-border space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-emerald" />
            Zero-Trust Vault
          </span>
          <span className="text-[10px] text-cyber-emerald font-semibold">SECURE</span>
        </div>
        <div className="text-[11px] text-slate-400 leading-tight font-sans">
          Firecrawl • OpenAI Embeddings • AgentMail Connected
        </div>
      </div>
    </aside>
  );
};
