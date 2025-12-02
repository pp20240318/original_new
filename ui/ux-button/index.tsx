import clsx from "clsx";

import styles from "./index.module.css";

type ButtonSize = "xs" | "sm" | "md" | "lg";
export type UxTypes =
  | "default"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";
const UxButton = ({
  type = "primary",
  size = "md",
  icon,
  disabled = false,
  className,
  style,
  onClick,
  children,
}: {
  type?: UxTypes;
  size?: ButtonSize;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => {
  const types = {
    default: "text-white hover:text-white/90 active:text-white/80",
    primary:
      "text-white bg-primary-default hover:bg-primary-hover active:bg-primary-active",
    info: "text-base-200 bg-base-600 hover:bg-base-700 active:bg-base-800",
    success:
      "text-white bg-success-default hover:bg-success-hover active:bg-success-active",
    warning:
      "text-white bg-warning-default hover:bg-warning-hover active:bg-warning-active",
    danger:
      "text-white bg-error-default hover:bg-error-hover active:bg-error-active",
  };

  const sizes = {
    xs: "h-7 px-2 py-1 text-xs rounded-md",
    sm: "h-9 px-4 py-2 text-sm rounded-lg",
    md: "h-12 px-6 py-3 text-base rounded-xl",
    lg: "h-14 px-8 py-4 text-xl rounded-2xl",
  };

  return (
    <button
      className={clsx(
        "flex justify-center items-center font-semibold select-none transition-colors",
        types[type],
        sizes[size],
        disabled && "cursor-not-allowed opacity-40 pointer-events-none",
        className
      )}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && <span className="w-6 h-6 mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const UxButton3D = ({
  size = "md",
  color = "red",
  disabled = false,
  loading = false,
  onlyIcon = false,
  onClick,
  className,
  // style,
  outerClass,
  innerClass,
  textClass,
  children,
}: Readonly<{
  size?: ButtonSize;
  color?: "red" | "green" | "blue";
  disabled?: boolean;
  loading?: boolean;
  onlyIcon?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
  outerClass?: string;
  innerClass?: string;
  textClass?: string;
  children: React.ReactNode;
}>) => {
  return (
    <button
      className={clsx(
        styles["button-3d"],
        styles[`button-3d_${size}`],
        styles[`button-3d_${color}`],
        loading && styles["button-3d_loading"],
        onlyIcon && styles["button-3d_only-icon"],
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={clsx(styles["button-3d__outer"], outerClass)}>
        {loading && (
          <span className={clsx(styles["button-3d__spinner"])}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
        )}
        <span className={clsx(styles["button-3d__inner"], innerClass)}>
          <span className={clsx(styles["button-3d__text"], textClass)}>
            {children}
          </span>
        </span>
      </span>
    </button>
  );
};

export { UxButton, UxButton3D };
