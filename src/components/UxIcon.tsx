import { CSSProperties } from "react";

export const UxIcon = ({
  name,
  size,
  color,
  className,
  style,
}: {
  name: string;
  size?: string | number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      style={style}
      fill={color || "currentColor"}
      width={size || "1em"}
      height={size || "1em"}
      aria-hidden="true"
      focusable="false"
    >
      <use xlinkHref={`icons.svg#${name}`}></use>
    </svg>
  );
};
