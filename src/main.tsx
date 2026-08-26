import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex items-center justify-center">
      <div className="cyber-card p-6 max-w-md text-center">
        <h1 className="text-xl font-display font-bold text-cyber-cyan mb-2">GovSniper</h1>
        <p className="text-sm text-slate-400 font-mono">Autonomous Procurement Command Center</p>
      </div>
    </div>
  </React.StrictMode>
);
