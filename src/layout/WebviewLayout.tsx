import { ComponentProps, useEffect } from "react";
import Container from "../components/Container/Container";
import { useSearchParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

interface WebviewProps {
  children: React.ReactNode;
}

export const WebviewLayout = ({ children, ...props }: WebviewProps & ComponentProps<typeof Container>) => {
  const [searchParams] = useSearchParams();
  const [darkMode, _setDarkMode] = useLocalStorage<boolean | undefined>("dark-mode", undefined);
  const darkTheme = searchParams.get("darkTheme");

  useEffect(() => {
    console.log("darkTheme: ", darkTheme);
    if (darkTheme === "true") _setDarkMode(true);
    else _setDarkMode(false);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Container showHeader={false} {...props}>
      {children}
    </Container>
  );
};
