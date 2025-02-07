import Blockly from "blockly/core";

const Theme = Blockly.Theme.defineTheme("dark", {
  name: "dark",
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: "var(--color-bg-primary)",
    flyoutBackgroundColour: "var(--color-bg-primary)",
    scrollbarColour: "var(--color-secondary)",
    scrollbarOpacity: 0.4,
  },
});
export default Theme;
