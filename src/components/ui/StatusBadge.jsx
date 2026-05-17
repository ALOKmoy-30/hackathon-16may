import React from 'react';

export function StatusBadge({ status = 'OFFLINE' }) {
  const statusStyles = {
    NORMAL: 'bg-[var(--status-normal-bg)] border border-[var(--status-normal-border)] text-[var(--status-normal-text)]',
    WARNING: 'bg-[var(--status-warning-bg)] border border-[var(--status-warning-border)] text-[var(--status-warning-text)]',
    DANGER: 'bg-[var(--status-danger-bg)] border border-[var(--status-danger-border)] text-[var(--status-danger-text)]',
    OFFLINE: 'bg-[var(--status-offline-bg)] border border-[var(--status-offline-border)] text-[var(--status-offline-text)]',
  };

  const badgeClass = statusStyles[status] || statusStyles.OFFLINE;

  return (
    <span className={
      `inline-flex items-center gap-2 px-[var(--space-3)] py-[var(--space-1)] rounded-[var(--radius-full)] text-[var(--text-xs)] font-[var(--weight-medium)] tracking-wide uppercase ${badgeClass}`
    }>
      {status === 'DANGER' && (
        <span className="w-2 h-2 rounded-full bg-[var(--status-danger-text)] shadow-[0_0_8px_rgba(255,68,68,0.6)] animate-pulse"></span>
      )}
      {status}
    </span>
  );
}
