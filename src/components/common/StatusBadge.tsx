import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'ready' | 'needs-practice' | 'marginal' | 'pending' | 'reviewed' | 'analysed' | 'neutral';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  let inferredType = type;
  if (!inferredType) {
    const s = status.toLowerCase();
    if (s.includes('ready') || s.includes('reviewed') || s.includes('analysed')) {
      inferredType = 'ready';
    } else if (s.includes('needs practice') || s.includes('danger') || s.includes('high')) {
      inferredType = 'needs-practice';
    } else if (s.includes('marginal') || s.includes('pending') || s.includes('medium')) {
      inferredType = 'marginal';
    } else {
      inferredType = 'neutral';
    }
  }

  const styles = {
    ready: 'text-[#16A34A] bg-[#F0FDF4] border-[#BBF7D0] hover:border-[#86EFAC]',
    'needs-practice': 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA] hover:border-[#FCA5A5]',
    marginal: 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A] hover:border-[#FCD34D]',
    pending: 'text-[#D97706] bg-[#FFFBEB] border-[#FDE68A] hover:border-[#FCD34D]',
    reviewed: 'text-[#0D9488] bg-[#F0FDFA] border-[#99F6E4] hover:border-[#5EEAD4]',
    analysed: 'text-[#2563EB] bg-[#EAF4FF] border-[#BFDBFE] hover:border-[#93C5FD]',
    neutral: 'text-[#64748B] bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]',
  }[inferredType];

  const dotColor = {
    ready: 'bg-[#16A34A]',
    reviewed: 'bg-[#14B8A6]',
    'needs-practice': 'bg-[#EF4444]',
    marginal: 'bg-[#F59E0B]',
    pending: 'bg-[#F59E0B]',
    analysed: 'bg-[#3B82F6]',
    neutral: 'bg-[#64748B]',
  }[inferredType];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded border transition-all duration-200 select-none ${styles}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {(inferredType === 'ready' || inferredType === 'pending') && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-50`} />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColor}`} />
      </span>
      <span>{status}</span>
    </span>
  );
};
