export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#090909]/80 z-50">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#00ff88] border-t-transparent" />
    </div>
  );
}
