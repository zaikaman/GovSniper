import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  Award, 
  Layers, 
  Sparkles,
  CheckCircle2,
  Plus
} from 'lucide-react';
import type { VendorProfile, PastPerformanceItem } from '@/types';

interface VendorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile?: (profile: Omit<VendorProfile, '_id' | 'updatedAt' | 'capabilityEmbedding'>) => Promise<void>;
  currentProfile?: VendorProfile | null;
}

export const VendorProfileModal: React.FC<VendorProfileModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  currentProfile,
}) => {
  const [name, setName] = useState(currentProfile?.name || 'Apex Cybernetics & Infrastructure Corp');
  const [industry, setIndustry] = useState(currentProfile?.industry || 'Energy, Defense, Cloud SCADA & Smart Grid Infrastructure');
  const [capabilities, setCapabilities] = useState<string[]>(
    currentProfile?.capabilities || [
      'SCADA & Substation Automation',
      'Smart Grid Zero-Trust Architecture',
      'Municipal Cloud Migration (FedRAMP High)',
      'Critical Infrastructure Cyber Resiliency',
    ]
  );
  const [newCapInput, setNewCapInput] = useState('');
  
  const [certifications, setCertifications] = useState<string[]>(
    currentProfile?.certifications || [
      'ISO 9001:2015',
      'ISO 27001',
      'SOC 2 Type II',
      'NIST 800-53 Rev 5 Compliant',
      'FedRAMP High Ready',
    ]
  );
  const [newCertInput, setNewCertInput] = useState('');

  const [bondingLimitUsd, setBondingLimitUsd] = useState(currentProfile?.bondingLimitUsd || 25000000);
  const [pastPerformance] = useState<PastPerformanceItem[]>(
    currentProfile?.pastPerformance || [
      {
        title: 'Texas Grid Substation Modernization',
        client: 'Austin Energy & Public Utilities',
        valueUsd: 18500000,
        year: 2025,
        summary: 'Deployed distributed sensor telemetry and automated fault isolation across 38 distribution substations with 99.999% uptime compliance.',
      },
      {
        title: 'Enterprise Water Treatment SCADA Upgrade',
        client: 'Phoenix Municipal Water District',
        valueUsd: 9200000,
        year: 2024,
        summary: 'Turnkey PLC replacement and zero-trust perimeter integration for 4 regional water reclamation facilities.',
      },
    ]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddCapability = () => {
    if (newCapInput.trim()) {
      setCapabilities([...capabilities, newCapInput.trim()]);
      setNewCapInput('');
    }
  };

  const handleRemoveCapability = (idx: number) => {
    setCapabilities(capabilities.filter((_, i) => i !== idx));
  };

  const handleAddCert = () => {
    if (newCertInput.trim()) {
      setCertifications([...certifications, newCertInput.trim()]);
      setNewCertInput('');
    }
  };

  const handleRemoveCert = (idx: number) => {
    setCertifications(certifications.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (onSaveProfile) {
        await onSaveProfile({
          name,
          industry,
          capabilities,
          certifications,
          bondingLimitUsd,
          pastPerformance,
        });
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Failed to save vendor profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cyber-panel border border-cyber-border-bright/50 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                Enterprise Vendor Profile
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
                  Vector Synced
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Used by OpenAI & Convex Vector Search to calculate Win Probability
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cyber-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5 text-sm">
          {/* Company Name & Core Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                Company Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-cyber-card border border-cyber-border rounded-lg text-white focus:outline-none focus:border-cyber-cyan text-sm"
                placeholder="e.g. Acme Tech Solutions LLC"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                Industry & Domain Focus
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="w-full px-3 py-2 bg-cyber-card border border-cyber-border rounded-lg text-white focus:outline-none focus:border-cyber-cyan text-sm"
                placeholder="e.g. Cloud Security, Defense, SCADA"
              />
            </div>
          </div>

          {/* Bonding Capacity Limit */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center justify-between">
              <span>Financial Surety Bonding Limit (USD)</span>
              <span className="text-cyber-cyan font-mono">${bondingLimitUsd.toLocaleString()}</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-mono">$</span>
              <input
                type="number"
                value={bondingLimitUsd}
                onChange={(e) => setBondingLimitUsd(Number(e.target.value))}
                required
                min={0}
                step={500000}
                className="w-full pl-8 pr-3 py-2 bg-cyber-card border border-cyber-border rounded-lg text-white font-mono focus:outline-none focus:border-cyber-cyan text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Required for automatic financial qualification checks against large municipal RFPs.
            </p>
          </div>

          {/* Core Technical Capabilities */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Core Technical Capabilities</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {capabilities.map((cap, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-medium"
                >
                  {cap}
                  <button
                    type="button"
                    onClick={() => handleRemoveCapability(idx)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCapInput}
                onChange={(e) => setNewCapInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCapability();
                  }
                }}
                placeholder="Add capability (e.g. Kubernetes, SCADA, Zero-Trust)..."
                className="flex-1 px-3 py-1.5 bg-cyber-card border border-cyber-border rounded-lg text-white text-xs focus:outline-none focus:border-cyber-cyan"
              />
              <button
                type="button"
                onClick={handleAddCapability}
                className="px-3 py-1.5 bg-cyber-surface hover:bg-cyber-cyan/20 border border-cyber-border hover:border-cyber-cyan/50 text-white rounded-lg text-xs flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Certifications & Compliances */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyber-emerald" />
              <span>Certifications & Standards</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-xs font-medium"
                >
                  {cert}
                  <button
                    type="button"
                    onClick={() => handleRemoveCert(idx)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCertInput}
                onChange={(e) => setNewCertInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCert();
                  }
                }}
                placeholder="Add certification (e.g. ISO 27001, SOC2, FedRAMP)..."
                className="flex-1 px-3 py-1.5 bg-cyber-card border border-cyber-border rounded-lg text-white text-xs focus:outline-none focus:border-cyber-emerald"
              />
              <button
                type="button"
                onClick={handleAddCert}
                className="px-3 py-1.5 bg-cyber-surface hover:bg-cyber-emerald/20 border border-cyber-border hover:border-cyber-emerald/50 text-white rounded-lg text-xs flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyber-border">
            <button
              type="button"
              onClick={onClose}
              className="cyber-button-secondary text-xs px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="cyber-button-primary text-xs px-5 py-2 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-black" />
                  <span>Computing Vector Embeddings...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Saved & Synced!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Save & Sync Vectors</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
