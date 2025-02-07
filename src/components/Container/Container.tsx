import { Flowbite } from "flowbite-react";
import { clsMerge } from "../../utils/styleUtils";
import Header from "../Header/index";
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  backLink?: string | boolean;
}
function Container({
  children,
  className,
  showHeader = true,
  backLink,
}: ContainerProps) {
  return (
    <Flowbite>
      <div
        className={clsMerge(
          `p-6 text-white bg-gradient-to-br from-bgFirst to-bgSecond min-h-screen`,
          className
        )}
      >
        {showHeader && <Header backLink={backLink} />}
        {children}
        <input id="c-global-file-input" type="file" hidden />
      </div>
    </Flowbite>
  );
}

export default Container;
