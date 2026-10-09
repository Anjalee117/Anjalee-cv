"use client";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-neutral-100 p-6">
      <div className="w-full max-w-md bg-white border-2 border-neutral-900 p-8 shadow-[6px_6px_0_#000]">
        <h1 className="font-bold text-xl mb-2">Something went wrong</h1>
        <p className="text-sm text-neutral-600 mb-6 break-words">{error.message || "An unexpected error occurred."}</p>
        <button onClick={reset} className="bg-neutral-900 text-white px-5 py-2 text-sm font-semibold">
          Try again
        </button>
      </div>
    </div>
  );
}
