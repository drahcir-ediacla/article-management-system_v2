"use client";

interface ButtonProps {
  onClick?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | (() => void);
  label?: string;
  className?: string;
  type?: "submit" | "reset" | "button"; // ✅ Restrict type to valid button types
}

const Button = ({ onClick, label, type, className }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-very-light-green font-medium p-[10px] bg-navy-blue border-none rounded-md ${className || ''}`.trim()}
    >
      {label}
    </button>
  );
};

export default Button;