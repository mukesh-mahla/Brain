import { forwardRef } from "react";

interface InputProps {
  placeholder: string;
  type?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ placeholder, type = "text" }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className="
          w-full
          px-4 py-3
          rounded-lg
          border border-slate-300
          bg-white
          text-slate-800
          placeholder-slate-400

          focus:outline-none
          focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500

          transition
          duration-200
          ease-out
        "
      />
    );
  }
);

Input.displayName = "Input";
