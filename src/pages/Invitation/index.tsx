import { useEffect, useState } from "react";
import FunkyHeading from "../../components/FunkyHeading/FunkyHeading";
import { useQueryParam } from "../../hooks/useQuery";
import {
  acceptInvitation,
  fetchInvitationWithRef,
  updateRoleUsingInvitation,
} from "../../services/workplace";
import { globalErrorHandler } from "../../utils/errorHandler";
import { Button } from "flowbite-react";
import { useLocalStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { profileAtom } from "../../atoms/profile";
import ProfileService from "../../services/profile";
import { toast } from "react-toastify";
import moment from "moment";
import { delay } from "../../utils/miscUtils";

function Invitation() {
  const navigate = useNavigate();
  const [query] = useQueryParam("token", undefined, "replace");
  const [invitationData, setInvitationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [isEmailMatched, setIsEmailMatched] = useState(true);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [darkMode, _setDarkMode] = useLocalStorage<boolean | undefined>(
    "dark-mode",
    undefined
  );
  const [profile, setProfile] = useAtom(profileAtom);
  useEffect(() => {
    if (query) {
      fetchInvitationWithRef(query)
        .then((res: any) => {
          const hoursDiff = moment().diff(res?.created_at, "hours");
          setIsExpired(hoursDiff > 24);
          setInvitationData(res);
          setIsEmailMatched(profile?.email === res?.invitee_email);
        })
        .catch(globalErrorHandler)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query, profile]);

  const handleAcceptInvitation = async () => {
    try {
      setAcceptLoading(true);
      await acceptInvitation(query).then(async () => {
        await delay(4000);
        await updateRoleUsingInvitation({
          role: invitationData?.account_role,
          // @ts-ignore
          userId: profile?.id,
          workplaceId: invitationData?.account_id?.id,
        });
      });
      const updatedProfile = await ProfileService.fetch(profile?.id);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
      toast.success(
        `Congratulations! You are now part of ${invitationData?.account_team_name}`
      );
      navigate("/");
    } catch (error) {
      globalErrorHandler(error);
    } finally {
      setAcceptLoading(false);
    }
  };
  return (
    <div>
      {loading ? null : (
        <>
          {!invitationData ? (
            <div className="flex items-center h-[90vh] justify-center">
              <FunkyHeading>
                Oops! Invitation not found, can you ask your admin to send you
                the invite again?
              </FunkyHeading>
            </div>
          ) : (
            <div className="text-center">
              {isEmailMatched ? (
                <>
                  {isExpired ? (
                    <div className="flex items-center h-[90vh] justify-center">
                      <FunkyHeading>
                        Your invitation has been expired, please ask your admin
                        to send the invite again.
                      </FunkyHeading>
                    </div>
                  ) : (
                    <>
                      <FunkyHeading className="pt-0 mt-4">
                        You have been invited to join
                      </FunkyHeading>
                      <div className="flex justify-center items-center">
                        <img
                          src={invitationData?.account_id?.workplace_logo}
                          alt="Company Logo"
                          className="mr-5 w-[30px]"
                        />
                        <p
                          className={`my-[20px] text-[30px] font-bold ${
                            darkMode ? "text-white" : "text-[#333]"
                          }`}
                        >
                          {invitationData?.account_team_name}
                        </p>
                      </div>
                      <p className="text-[#999] -mt-[10px]">
                        as a {invitationData?.account_role}
                      </p>
                      <div className="h-[1px] mx-[50px] bg-[#333] my-[40px]" />
                      {invitationData?.message && (
                        <>
                          <p
                            className={`my-[20px] text-[30px] font-bold ${
                              darkMode ? "text-white" : "text-[#333]"
                            }`}
                          >
                            Message from the Team Owner
                          </p>
                          <p className="text-[#999] -mt-[10px] w-[400px] mx-auto">
                            {invitationData?.message}
                          </p>
                        </>
                      )}
                      <div className="flex absolute bottom-[60px] w-[95%] justify-end">
                        <Button
                          className="w-[120px] !bg-red-800 hover:!bg-red-600"
                          onClick={() => navigate("/")}
                        >
                          Ignore
                        </Button>
                        <div className="w-[10px]" />
                        <Button
                          className="w-[120px] !bg-primaryDark hover:!bg-primary"
                          onClick={handleAcceptInvitation}
                          isProcessing={acceptLoading}
                        >
                          Join
                        </Button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center h-[90vh] justify-center">
                  <FunkyHeading>
                    Please login from the correct credentials to view the
                    invitation
                  </FunkyHeading>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Invitation;
