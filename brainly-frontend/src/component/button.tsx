import type { ReactElement } from "react";

interface ButtonProps {
  varient: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const varientStyle = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]",
  secondary:
    "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:scale-[0.98]",
};

const sizeStyle = {
  sm: "px-3 py-2 text-sm rounded-md",
  md: "px-4 py-3 text-base rounded-lg",
  lg: "px-6 py-4 text-lg rounded-xl",
};

export const Button = ({
  varient,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
  fullWidth,
  loading,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        ${varientStyle[varient]}
        ${sizeStyle[size]}
        ${fullWidth ? "w-full" : ""}
        flex items-center justify-center gap-2

        font-medium
        transition
        duration-200
        ease-out

        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}

      <span>{loading ? "Please wait..." : text}</span>

      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};
