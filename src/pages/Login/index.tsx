import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../../services/supabase";
import { useLocalStorage } from "usehooks-ts";
import FunkyHeading from "../../components/FunkyHeading/FunkyHeading";
import blocklyIcon from "../../assets/blocklyLogo.png";
import { useQueryParam } from "../../hooks/useQuery";

function Login() {
  const [darkMode] = useLocalStorage<boolean | undefined>(
    "dark-mode",
    undefined
  );
  const [gotoQuery] = useQueryParam("goto", undefined, "replace");

  return (
    <div className="max-w-lg m-auto mt-6">
      <div className="flex flex-col items-center mb-6">
        <img src={blocklyIcon} alt="title" width={72} />
        <FunkyHeading>Blockode</FunkyHeading>
      </div>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: darkMode ? "rgb(219, 169, 61)" : "rgb(41, 97, 96)",
                brandAccent: darkMode
                  ? "rgb(255, 198, 75)"
                  : "rgb(33, 115, 113)",
              },
            },
          },
        }}
        theme={darkMode ? "dark" : "default"}
        providers={["google"]}
        queryParams={{
          signup_intent: "login",
          forgot_password_intent: "login",
          prompt: "consent",
        }}
        redirectTo={
          gotoQuery
            ? `${window.location.origin}${gotoQuery}`
            : `${window.location.origin}`
        }
      />
    </div>
  );
}

export default Login;
