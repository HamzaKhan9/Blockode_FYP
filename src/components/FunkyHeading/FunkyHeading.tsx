import { clsMerge } from "../../utils/styleUtils";

interface FunkyHeadingProps {
  children: React.ReactNode;
  className?: string;
}

function FunkyHeading({ children, className }: FunkyHeadingProps) {
  return (
    <h1
      className={clsMerge(
        `text-5xl text-center p-1 font-heading text-transparent bg-clip-text bg-gradient-to-r from-primary to-primaryDark`,
        className
      )}
    >
      {children}
    </h1>
  );
}

export default FunkyHeading;
