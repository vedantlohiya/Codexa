import React from 'react';
import { Info } from 'lucide-react';

interface DemoBannerProps {
  label?: string;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  label = 'Frontend Prototype: Repository syncing, speech recognition, and AI evaluation are local simulations for demonstration purposes.',
}) => {
  return (
    <div className="bg-[#F5F8FC] border-b border-[#E2E8F0] px-4 py-1.5 text-xs text-[#64748B] flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 truncate">
        <Info className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <span className="text-[11px] font-semibold text-[#183653] shrink-0 border border-[#CBD5E1] bg-white px-2 py-0.5 rounded shadow-xs">
        DEMO MODE
      </span>
    </div>
  );
};
