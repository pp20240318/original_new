import React from "react";

interface PopupProps {
  visible: boolean;
  onClose?: () => void;
  position?: "top" | "bottom" | "right" | "left" | "center";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Popup: React.FC<PopupProps> = ({
  visible,
  onClose,
  position = "center",
  children,
  className,
  style,
}) => {
  if (!visible) return null;

  const getPositionClass = (position: string) => {
    switch (position) {
      case "top":
        return "top-0 left-0 right-0 rounded-b-lg";
      case "bottom":
        return "bottom-0 left-0 right-0 rounded-t-lg";
      case "right":
        return "top-0 right-0 bottom-0 rounded-l-lg";
      case "left":
        return "top-0 left-0 bottom-0 rounded-r-lg";
      case "center":
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg";
      default:
        return "";
    }
  };

  return (
    <div
      className={`fixed inset-0  bg-opacity-50 max-h-full bg-gray-800 z-50`}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div
        className={`${getPositionClass(position)} absolute m-auto  shadow-lg ${
          className !== undefined ? className : ""
        }`}
        style={{ ...style, width: document.body.style.maxWidth }}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
