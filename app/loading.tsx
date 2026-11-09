export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-black"></div>
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
