interface ContentMessageProps {
  message: string;
  variant?: "empty" | "error";
}

export function ContentMessage({ message, variant = "empty" }: ContentMessageProps) {
  return (
    <p
      className={`text-sm text-center py-8 ${
        variant === "error" ? "text-rose-600" : "text-slate-500"
      }`}
    >
      {message}
    </p>
  );
}
