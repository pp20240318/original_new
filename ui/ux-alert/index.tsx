import {
  CSSProperties,
  MutableRefObject,
  ReactNode,
  SyntheticEvent,
  useRef,
  useState,
} from "react";
import "./index.css";
import { XMarkIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { createRoot } from "react-dom/client";

type UxAlertType = "success" | "info" | "warning" | "error";

export interface UxMessageProps {
  type?: UxAlertType;
  title?: string;
  content: ReactNode;
  duration?: number;
  closeable?: boolean;
  onClose?: () => void;
}

const UxAlert = ({
  type = "info",
  title,
  closeable = true,
  className,
  style,
  onClose,
  children,
}: {
  type?: UxAlertType;
  title?: string;
  closeable?: boolean;
  className?: string;
  style?: CSSProperties;
  onClose?: (e: SyntheticEvent) => void;
  children: ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "flex items-start text-white leading-normal py-3 rounded-xl",
        type === "error"
          ? "bg-error-default"
          : type === "success"
          ? "bg-success-default"
          : type === "warning"
          ? "bg-warning-active"
          : "bg-primary-default",
        className
      )}
      style={style}
    >
      <div className="grow px-4">
        {title !== "" && (
          <h3 className="text-md font-bold mb-1">
            {title ?? type.toUpperCase()}
          </h3>
        )}
        <p className="text-xs font-semibold break-all py-0.5">{children}</p>
      </div>
      {closeable && (
        <button className="shrink-0 hover:text-white/80 mr-2" onClick={onClose}>
          <XMarkIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

const UxMessageItem = ({
  content,
  closeable = false,
  duration = 2500,
  onClose,
  ...alertProps
}: UxMessageProps) => {
  const [closed, setClosed] = useState(false);

  const messageRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const messageAnimationEndHandler = () => {
    onClose?.();
    messageRef.current?.removeEventListener(
      "animationend",
      messageAnimationEndHandler
    );
  };

  const onMessageClose = () => {
    setClosed(true);
    messageRef.current?.addEventListener(
      "animationend",
      messageAnimationEndHandler
    );
  };

  if (duration > 0) setTimeout(onMessageClose, duration);

  return (
    <div
      ref={messageRef}
      className={clsx(
        "fixed top-4 left-8 right-8 z-[1000]",
        closed ? "ux-message-leave" : "ux-message-enter"
      )}
    >
      <UxAlert {...alertProps} closeable={closeable} onClose={onMessageClose}>
        {content}
      </UxAlert>
    </div>
  );
};

const createMessage =
  (type: UxAlertType) => (props: UxMessageProps | string) => {
    const uxPortal = document.createElement("div");
    uxPortal.className = "ux-portal";
    document.body.appendChild(uxPortal);
    if (typeof props === "string") props = { content: props };
    const onClose = () => {
      messageRoot.unmount();
      uxPortal.remove();
    };
    const messageRoot = createRoot(uxPortal);
    messageRoot.render(
      <UxMessageItem {...props} type={type} onClose={onClose} />
    );
  };

const UxMessage = {
  success: createMessage("success"),
  error: createMessage("error"),
  warning: createMessage("warning"),
  info: createMessage("info"),
};

export { UxAlert, UxMessage };
