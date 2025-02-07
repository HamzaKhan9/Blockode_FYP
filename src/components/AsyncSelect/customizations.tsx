import { useLocalStorage } from "usehooks-ts";
import { components } from "react-select";

export const Option = (props: any) => {
  const { logo } = props.data.data;
  return (
    <components.Option {...props}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {props?.showIcon && (
          <img src={logo} alt="workplace logo" className="h-[20px] mr-2" />
        )}
        <p>{props.label}</p>
      </div>
    </components.Option>
  );
};

export const MenuList = (props: any) => {
  const [darkMode] = useLocalStorage<boolean | undefined>(
    "dark-mode",
    undefined
  );

  return (
    <div>
      <components.MenuList {...props} />
      {props.selectProps.inputValue && props.showAddNew && (
        <div
          onClick={props.onClick}
          className={`${
            darkMode ? "text-gray-200" : "text-gray-600"
          }  px-[10px] py-[6px] cursor-pointer`}
        >
          + Add {props.selectProps.inputValue}
        </div>
      )}
    </div>
  );
};
