import { ComponentProps, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { supabase } from "../services/supabase";
import Redirect from "../components/Redirect";
import Container from "../components/Container/Container";
import SplashScreen from "./SplashScreen";
import { Session } from "@supabase/supabase-js";
import { useAtom } from "jotai";
import { profileAtom } from "../atoms/profile";
import { globalErrorHandler } from "../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import { useQueryParam } from "../hooks/useQuery";
import analytics from "../analytics";
import { detectOS } from "../utils/miscUtils";
import ProfileService from "../services/profile";

export enum AuthType {
  ONLY_AUTHENTICATED = "ONLY_AUTHENTICATED",
  ONLY_UNAUTHENTICATED = "ONLY_UNAUTHENTICATED",
  NONE = "NONE",
}
interface LayoutProps {
  children: React.ReactNode;
  authType: AuthType;
}

function PageLayout({
  children,
  authType,
  ...props
}: LayoutProps & ComponentProps<typeof Container>) {
  const [gotoQuery] = useQueryParam("goto", undefined, "replace");
  const [tokenQuery] = useQueryParam("token", undefined, "replace");
  // console.log({ query });
  const [session, setSession] = useState<Session | null>();
  const [splashEnded, setSplashEnded] = useState(false);
  const [profile, setProfile] = useAtom(profileAtom);
  const [darkMode, _setDarkMode] = useLocalStorage<boolean | undefined>(
    "dark-mode",
    undefined
  );
  const isDeletionPage = useMemo(
    () => location.pathname.includes("/delete-account"),
    [location.pathname]
  );

  const isInvitationPage = useMemo(
    () => location.pathname.includes("invitation"),
    [location.pathname]
  );

  const navigate = useNavigate();

  useEffect(() => {
    analytics.trackPage(location.href);
  }, [location.pathname]);
  useEffect(() => {
    if (isDeletionPage) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user.id) {
      (async () => {
        let { data, error } = await supabase
          .from("profiles")
          .select(`*, game_info(*)`)
          .eq("id", session.user.id)
          .single();

        if (error && error.message.includes("multiple (or no) rows returned")) {
          await ProfileService.create({
            id: session.user.id,
            email: session.user.email!,
          });

          const result = await supabase
            .from("profiles")
            .select(`*, game_info(*)`)
            .eq("id", session.user.id)
            .single();

          data = result.data;
          error = result.error;
        }

        // Handle any remaining errors.
        if (error) {
          globalErrorHandler(error);
          return;
        }

        // Process the data if available.
        if (data) {
          setProfile(data);

          if (!isDeletionPage && !data.name) {
            if (gotoQuery || tokenQuery) {
              const token = tokenQuery || gotoQuery.split("=")[1];
              navigate(`/my-profile?edit=true&token=${token}`);
              return;
            }
            navigate("/my-profile?edit=true");
            return;
          }

          if (!isDeletionPage && gotoQuery) {
            navigate(gotoQuery);
            return;
          }
        }

        // Analytics tracking.
        analytics.identifyUser(session.user.id, {
          email: data?.email,
          operating_system: detectOS(),
        });
        analytics.trackEvent("session_start");
      })();
    } else {
      setProfile(undefined);
    }
  }, [session?.user.id]);

  useEffect(() => {
    const observer = new MutationObserver(function () {
      const isDark = localStorage.getItem("dark-mode") === "true";
      if (!document.documentElement?.classList.contains("dark") && isDark) {
        document.documentElement.classList.add("dark");
      } else if (
        document.documentElement?.classList.contains("dark") &&
        !isDark
      ) {
        document.documentElement.classList.remove("dark");
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      childList: false,
      characterData: false,
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (
    (!isDeletionPage && session === undefined) || // fetching session state
    (session && !profile) || // fetching profile after logged in
    !splashEnded // splash screen animation is running
  ) {
    return (
      <Container showHeader={false}>
        <SplashScreen endLoading={() => setSplashEnded(true)} />
      </Container>
    );
  }

  if (
    authType === AuthType.ONLY_AUTHENTICATED &&
    !session &&
    isInvitationPage
  ) {
    return (
      <Redirect link={`/login?goto=${location.pathname + location.search}`} />
    );
  }

  if (authType === AuthType.ONLY_AUTHENTICATED && !session) {
    return <Redirect link="/login" />;
  }

  if (authType === AuthType.ONLY_UNAUTHENTICATED && session) {
    return <Redirect link="/" />;
  }

  return <Container {...props}>{children}</Container>;
}

export default PageLayout;
