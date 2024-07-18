import { FunctionComponent, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  background?: string;
  maxWidth?: string;
}

const Wrapper: FunctionComponent<Props> = ({
  children,
  className,
  background,
  maxWidth = "75rem",
}) => {
  return (
    <div
      className={`h-full w-full ${
        background === "" ? "bg-inherit" : background
      }`}
    >
      <div
        className={`mx-auto h-full w-[90vw] ${className}`}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
