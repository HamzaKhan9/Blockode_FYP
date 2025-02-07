import React, { ReactNode } from "react";

interface BlocklyElementProps {
  children?: ReactNode;
  [key: string]: any;
}

function createBlocklyElement(elemName: string) {
  return (props: BlocklyElementProps): JSX.Element => {
    const { children, ...rest } = props;
    rest.is = "blockly";
    return React.createElement(elemName, rest, children);
  };
}

export const Block = createBlocklyElement("block");
export const Category = createBlocklyElement("category");
export const Value = createBlocklyElement("value");
export const Field = createBlocklyElement("field");
export const Shadow = createBlocklyElement("shadow");
