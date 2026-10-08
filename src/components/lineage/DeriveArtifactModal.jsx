import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { GitFork } from 'lucide-react';
import { lineageService } from '../../services/lineageService';

export const DeriveArtifactModal = ({ isOpen, onClose, parentNode, onDerived }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Derived Artifact (IOC Set)',
    filename: 'extracted_ioc_telemetry.json',
    size: '1.2 MB',
    creator: 'Organization B (Cyber Defense Lab)'
  });
  const [computedHash] = useState('18f92a4019283019283019283019284019283019283019283019283019283019');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await lineageService.deriveArtifact(parentNode?.id || 'EV-001', {
      ...formData,
      hash: computedHash
    });
    if (onDerived) onDerived(result);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DERIVE EVIDENCE ARTIFACT"
      subtitle={`Create child artifact maintaining mathematical lineage link to parent: ${parentNode?.id || 'EV-001'}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
        <div>
          <label className="block text-ce-text-secondary font-semibold mb-1">
            Derived Artifact Title:
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Decompiled String IOCs & Regex Signatures"
            className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary placeholder:text-ce-text-muted focus:outline-none focus:border-ce-brand"
          />
        </div>

        <div>
          <label className="block text-ce-text-secondary font-semibold mb-1">
            Artifact Type:
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand cursor-pointer"
          >
            <option value="Derived Artifact (IOC Set)">Derived Artifact (IOC Set)</option>
            <option value="Derived Artifact (Report)">Derived Artifact (Report)</option>
            <option value="Intermediate Analysis">Intermediate Analysis</option>
            <option value="Attribution Dossier">Attribution Dossier</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-ce-text-secondary font-semibold mb-1">
              File Name:
            </label>
            <input
              type="text"
              value={formData.filename}
              onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
            />
          </div>

          <div>
            <label className="block text-ce-text-secondary font-semibold mb-1">
              File Size:
            </label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full bg-ce-bg border border-ce-border rounded-md px-3 py-2 text-ce-text-primary focus:outline-none focus:border-ce-brand"
            />
          </div>
        </div>

        <div className="p-3 rounded-md bg-ce-bg border border-ce-border">
          <div className="text-[10px] text-ce-brand font-bold uppercase tracking-wider mb-1">
            SHA-256 Digest (Auto-Generated):
          </div>
          <div className="text-[11px] text-ce-success font-bold break-all select-all">
            {computedHash}
          </div>
        </div>

        <div className="pt-4 border-t border-ce-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-ce-surface-subtle border border-ce-border text-ce-text-secondary hover:text-ce-text-primary hover:bg-ce-surface-elevated transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-ce-brand hover:bg-ce-brand-hover text-white font-bold transition-colors shadow-sm"
          >
            <GitFork className="w-4 h-4" />
            <span>Anchor Lineage Node</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
