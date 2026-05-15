import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-oled-black bg-opacity-75 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-green"></div>
    </div>
  );
}
