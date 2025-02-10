import { Dropdown, Avatar, Button } from "flowbite-react";
import { useLocalStorage } from "usehooks-ts";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../BackButton/BackButton";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { BiLogInCircle, BiHelpCircle } from "react-icons/bi";
import { supabase } from "../../services/supabase";
import { useAtom } from "jotai";
import { profileAtom } from "../../atoms/profile";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertPopup } from "../AlertPopup";
import { toast } from "react-toastify";
import { getInitials } from "../../utils/stringUtils";
import { clsMerge } from "../../utils/styleUtils";
import analytics from "../../analytics";

interface HeaderProps {
  backLink?: string | boolean;
  onShowHelp?: () => void;
}

function Header({ backLink, onShowHelp }: HeaderProps) {
  const navigate = useNavigate();
  const [profile] = useAtom(profileAtom);
  const [showBg, setShowBg] = useState(window.scrollY > 0);
  const [darkMode, _setDarkMode] = useLocalStorage<boolean | undefined>(
    "dark-mode",
    undefined
  );
  const location = useLocation();

  const isProfileComplete =
    profile?.name &&
    Boolean(profile?.workplace_ref || profile?.institution_ref);
  const onLogout = useCallback(() => {
    AlertPopup({
      message: "Are you sure you want to logout?",
      variant: "warning",
      onOk: () => supabase.auth.signOut().then(() => toast.info("Logged out!")),
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBg(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const displayName = profile?.name || profile?.email || "";
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const isLoginPage = useMemo(
    () => location.pathname.includes("/login"),
    [location.pathname]
  );
  const isDeletionPage = useMemo(
    () => location.pathname.includes("/delete-account"),
    [location.pathname]
  );

  return (
    <>
      <div
        className={clsMerge(
          `fixed left-0 right-0 top-0 h-[88px] z-[49] transition-all duration-300 ${
            darkMode ? "border-neutral-600" : "border-neutral-300"
          }`,
          showBg
            ? `bg-bgFirst pointer-events-auto border-b`
            : "bg-transparent pointer-events-none"
        )}
      />
      <div className="flex items-center justify-between sticky top-6 z-50 h-[40px]">
        {backLink && isProfileComplete ? (
          <BackButton
            onClick={() => {
              analytics.trackEvent("clicked_back");
              typeof backLink === "string" ? navigate(backLink) : navigate(-1);
            }}
          />
        ) : (
          <div />
        )}
        <div className="flex gap-4">
          {onShowHelp && (
            <button
              className="text-3xl cursor-pointer"
              onClick={onShowHelp}
              title="Help"
            >
              <BiHelpCircle className="text-primary" />
            </button>
          )}

          <button
            className="text-2xl cursor-pointer"
            onClick={() => _setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <BsFillSunFill className="text-primary" />
            ) : (
              <BsFillMoonFill className="text-primary" />
            )}
          </button>

          {isDeletionPage ? null : profile ? (
            <Dropdown
              inline
              label={
                <Avatar
                  placeholderInitials={initials}
                  img={profile?.profile_photo || ""}
                  alt={displayName}
                  size="md"
                  rounded
                />
              }
              arrowIcon={false}
            >
              {isProfileComplete && (
                <>
                  <Dropdown.Item
                    className="text-black font-semibold hover:bg-primary hover:text-white"
                    onClick={() => navigate("/my-profile")}
                  >
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Divider className="my-2" />
                  {/* <Dropdown.Item
                    className="text-black font-semibold hover:bg-primary hover:text-white"
                    onClick={() => navigate("/my-stats")}
                  >
                    Stats
                  </Dropdown.Item>
                  <Dropdown.Divider className="my-2" /> */}
                </>
              )}
              <Dropdown.Item
                className="text-black font-semibold hover:bg-primary hover:text-white"
                onClick={onLogout}
              >
                Logout
              </Dropdown.Item>
            </Dropdown>
          ) : isLoginPage ? null : (
            <Button onClick={() => navigate("/login")} color="light">
              <BiLogInCircle className="mr-2 h-5 w-5" />
              <p>Sign in</p>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
