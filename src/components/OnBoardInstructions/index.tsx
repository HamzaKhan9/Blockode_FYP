import React from "react";
import ReactJoyride from "react-joyride";

type IProps = React.ComponentProps<typeof ReactJoyride>;

const MyJoyride: React.FC<IProps> = (props: IProps) => {
  return (
    <ReactJoyride
      continuous
      showProgress
      hideCloseButton
      disableOverlayClose
      showSkipButton
      styles={{
        options: {
          backgroundColor: "var(--color-bg-primary)",
          arrowColor: "var(--color-bg-primary)",
          primaryColor: "var(--color-primary)",
          textColor: "var(--color-text)",
        },
      }}
      {...props}
    />
  );
};

export default MyJoyride;
