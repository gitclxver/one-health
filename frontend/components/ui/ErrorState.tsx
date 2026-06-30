import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-rose-500" />
      </div>
      <p className="text-slate-600 max-w-md">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 px-5 py-2.5 rounded-full bg-slate-700 text-white text-sm font-semibold hover:bg-slate-600 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
