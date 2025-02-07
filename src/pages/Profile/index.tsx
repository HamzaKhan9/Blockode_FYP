import FunkyHeading from "../../components/FunkyHeading/FunkyHeading";
import { Label, TextInput, Button, Avatar } from "flowbite-react";
import { HiMail } from "react-icons/hi";
import { BsFillPersonFill } from "react-icons/bs";
import { AiFillEdit, AiOutlineClose } from "react-icons/ai";
import { MdModeEditOutline } from "react-icons/md";
import { useAtom } from "jotai";
import { profileAtom } from "../../atoms/profile";
import { getInitials } from "../../utils/stringUtils";
import { useMemo, useState, useCallback } from "react";
import { useQueryParam } from "../../hooks/useQuery";
import { useNavigate } from "react-router-dom";
import { pickFiles } from "../../utils/fileUtils";
import ProfileService from "../../services/profile";
import { globalErrorHandler } from "../../utils/errorHandler";
import analytics from "../../analytics";
const index = () => {
  const [profile, setProfile] = useAtom(profileAtom);
  const initials = useMemo(
    () => getInitials(profile?.name || profile?.email || ""),
    [profile]
  );
  const [profileImage, setProfileImage] = useState<File>();
  const [editMode, setEditMode] = useQueryParam("edit", undefined, "replace");
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const handlePictureUpload = useCallback(() => {
    pickFiles({
      accept: "image/*",
      multiple: false,
      maxMBs: 10,
      onChange: (files) => {
        setProfileImage(files[0]);
      },
    });
  }, []);

  const handleProfileUpdate = async (e: any) => {
    try {
      e.preventDefault();
      setSubmitLoading(true);

      // workplace: e.target.workplace.value,
      const updates = {
        id: profile?.id!,
        name: e.target.name.value,
        profile_photo: profile?.profile_photo!,
        newProfilePic: profileImage,
      };

      const data = await ProfileService.upsert(updates);

      // workplace: e.target.workplace.value,
      if (profile && data) {
        setProfile({
          ...(profile || {}),
          name: e.target.name.value,
          profile_photo: data.profile_photo,
        });

        if (!profile?.name) {
          navigate("/");
        }
      }

      setProfileImage(undefined);
      setEditMode(undefined);
      analytics.trackEvent("saved_profile");
    } catch (err) {
      globalErrorHandler(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const showEdit =
    profile?.name &&
    Boolean(profile?.workplace_ref || profile?.institution_ref);
  return (
    <div>
      <FunkyHeading className="pt-0 mt-4">My Profile</FunkyHeading>
      {showEdit && (
        <Button
          className="h-14 w-14 rounded-full fixed right-6 bottom-8 z-10 bg-gradient-to-r from-primary to-primary"
          onFocus={(e: any) => e.target?.blur()}
          disabled={submitLoading}
        >
          {editMode ? (
            <AiOutlineClose
              className="h-6 w-6"
              onClick={() => {
                setProfileImage(undefined);
                setEditMode(undefined);
              }}
            />
          ) : (
            <AiFillEdit
              className="h-6 w-6"
              onClick={() => setEditMode("true")}
            />
          )}
        </Button>
      )}
      <form
        id="mainForm"
        className="flex max-w-md flex-col gap-4 mt-8 m-auto"
        autoComplete="off"
        onSubmit={handleProfileUpdate}
      >
        <div className="relative m-auto">
          <Avatar
            placeholderInitials={initials}
            img={
              profileImage
                ? URL.createObjectURL(profileImage)
                : profile?.profile_photo || ""
            }
            alt={"avatar"}
            size="lg"
            rounded
          />
          {editMode && (
            <button
              type="button"
              onClick={handlePictureUpload}
              className="absolute bottom-0 -right-1 flex justify-center items-center h-7 w-7 rounded-full bg-black bg-primaryDark bg-opacity-50 hover:bg-opacity-75"
            >
              <MdModeEditOutline />
            </button>
          )}
        </div>
        <div>
          <div className="mb-2">
            <Label htmlFor="email" value="Your Email" />
          </div>
          <TextInput
            rightIcon={HiMail}
            id="email"
            placeholder="ex: name@blockode.com"
            readOnly
            type="email"
            value={profile?.email || ""}
            onFocus={(e) => e.target.blur()}
          />
        </div>
        <div>
          <div className="mb-2">
            <Label htmlFor="name" value="Your Name" />
          </div>
          <TextInput
            rightIcon={BsFillPersonFill}
            id="name"
            placeholder="ex: Bob Smith"
            required
            readOnly={!editMode}
            type="text"
            defaultValue={profile?.name || ""}
            disabled={submitLoading}
          />
        </div>
        {editMode && (
          <Button
            form="mainForm"
            type="submit"
            className="mt-4 !bg-primaryDark hover:!bg-primary"
            isProcessing={submitLoading}
          >
            Save
          </Button>
        )}
      </form>
    </div>
  );
};

export default index;
