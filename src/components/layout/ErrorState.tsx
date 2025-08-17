"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  error?: Error | unknown;
  title?: string;
  description?: string;
}

export default function ErrorState({
  error,
  title = "Something went wrong",
  description = "Please try again later",
}: ErrorStateProps) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-[var(--error)] mx-auto mb-4" />
        <div className="text-[var(--error)] text-lg mb-2">{title}</div>
        <div className="text-[var(--text-muted)] text-sm">{description}</div>
        {error && (
          <div className="mt-4 text-xs text-[var(--text-muted)] bg-[var(--error)]/5 p-2 rounded">
            {error.message || "Unknown error occurred"}
          </div>
        )}
        <button
          onClick={handleGoBack}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-light)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
