import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const classes = {
  base: "border transition ease-in-out duration-300 w-full max-w-md focus-visible:outline-none",
  disabled: "opacity-50",
  pill: "rounded-full",
  size: {
    small: "px-2 py-1 text-sm",
    normal: "px-4 py-2",
    large: "px-8 py-3 text-lg",
  },
  variant: {
    primary: "border-blue-green text-blue-green hover:brightness-125",
    secondary:
      "border-black hover:border-gray-300 hover:text-gray-500",
  },
};

const Button = forwardRef(
  (
    {
      children,
      type = "button",
      className,
      variant = "primary",
      size = "normal",
      pill,
      disabled = false,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled}
      type={type}
      className={`${classes.base} ${classes.size[size]} ${
        classes.variant[variant]
      } ${pill ? classes.pill : ""} ${
        disabled ? classes.disabled : ""
      } ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.propTypes = {
  submit: PropTypes.oneOf(["submit", "button"]),
  className: PropTypes.string,
  pill: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]),
  size: PropTypes.oneOf(["small", "normal", "large"]),
};

export default Button;
