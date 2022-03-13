import React, { forwardRef } from "react";

const classes = {
  base: "border transition ease-in-out duration-300 w-full max-w-md focus-visible:outline-none",
  disabled: "opacity-50",
  size: {
    small: "px-2 py-1 text-sm",
    normal: "px-4 py-2",
    large: "px-8 py-3 text-lg",
  },
  variant: {
    primary: "border-blue-green text-blue-green hover:brightness-125",
    secondary: "border-black hover:border-gray-300 hover:text-gray-500",
  },
};

const Button = forwardRef(
  (
    {
      children,
      className,
      variant = "primary",
      size = "normal",
      disabled = false,
      ...props
    }: Partial<ButtonProps>,
    ref
  ) => {
    const cls =
      classes.base +
      " " +
      classes.size[size] +
      " " +
      classes.varian[variant] +
      " " +
      (disabled ? classes.disabled : "") +
      (className || "");
    return (
      <button
        ref={ref}
        className={cls}
        disabled={disabled}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  }
);

interface ButtonProps {
  className: string;
  disabled: boolean;
  variant: "primary" | "secondary";
  size: "small" | "normal" | "large";
}

export default Button;
