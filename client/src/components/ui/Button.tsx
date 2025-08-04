import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-full font-semibold transition-colors";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
