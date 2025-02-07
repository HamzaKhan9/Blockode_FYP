import AsyncSelectt from "react-select/async";
import { SelectType } from "../../types/common";
import { useLocalStorage } from "usehooks-ts";
import { MenuList, Option } from "./customizations";
interface AsyncSelectProps {
  onClick?: () => void;
  onAddNew?: () => void;
  loadOptions: (val: any) => Promise<SelectType[]>;
  onChange?: (val: any) => void;
  menuPlacment?: any;
  value: any;
  name: string;
  isDisabled?: boolean;
  showAddNew?: boolean;
  showIcon?: boolean;
  placeholder?: string;
  required?: boolean;
}

const AsyncSelect = (props: AsyncSelectProps) => {
  const { onAddNew, showAddNew = true, showIcon = true } = props;
  const [darkMode] = useLocalStorage<boolean | undefined>(
    "dark-mode",
    undefined
  );

  return (
    <div>
      <AsyncSelectt
        name={props.name}
        required={props.required}
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: darkMode ? "#374151" : "#F9FAFB",
            outline: "none",
            border: `1px solid ${darkMode ? "#4b5563" : "#d0d5db"}`,
            height: 41,
            borderRadius: 8,
            fontSize: 14,
          }),
          option: (styles, { isFocused }) => {
            return {
              ...styles,
              color: darkMode ? "#fff" : "#333",
              background: isFocused && darkMode ? "#0b2a59" : styles.background,
            };
          },
          singleValue: (styles) => ({
            ...styles,
            color: darkMode ? "#fff" : styles.color,
          }),
          input: (styles) => ({
            ...styles,
            color: darkMode ? "#fff" : styles.color,
          }),
          placeholder: (styles) => ({
            ...styles,
            color: darkMode ? "#9ca3af" : styles.color,
          }),
          menu: (styles) => ({
            ...styles,
            backgroundColor: darkMode ? "#374151" : "#F9FAFB",
          }),
        }}
        loadOptions={props.loadOptions}
        components={{
          MenuList: (props) => (
            <MenuList onClick={onAddNew} showAddNew={showAddNew} {...props} />
          ),
          Option: (props) => <Option showIcon={showIcon} {...props} />,
        }}
        onChange={props.onChange}
        value={props.value}
        menuPlacement={props?.menuPlacment || "bottom"}
        isDisabled={props?.isDisabled}
        placeholder={props?.placeholder || "Select..."}
      />
    </div>
  );
};

export default AsyncSelect;
