"use client";

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        <span className="text-[var(--text-muted)]">{message}</span>
      </div>
    </div>
  );
}

