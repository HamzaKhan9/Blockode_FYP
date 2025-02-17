import { TableRow } from "../../types/common";
import { globalErrorHandler } from "../../utils/errorHandler";
import { supabase } from "../supabase";

export type ProfileInfo = TableRow<"profiles">;

const upsert = async (record: {
  id: ProfileInfo["id"];
  profile_photo: ProfileInfo["profile_photo"];
  name: ProfileInfo["name"];
  newProfilePic?: File | null;
}) => {
  try {
    const { id, newProfilePic, profile_photo, name } = record;

    const storageBucket = supabase.storage.from("default");
    if (profile_photo && newProfilePic) {
      const prevTimeStamp = profile_photo.match(/-(\d+)\.png$/)![1];
      await storageBucket.remove([`${id}/profileAvatar-${prevTimeStamp}.png`]);
    }

    const updatedData: Partial<ProfileInfo> = {
      name: name,
    };

    if (newProfilePic) {
      const imagePath = `${id}/profileAvatar-${Date.now()}.png`;
      await storageBucket.upload(imagePath, newProfilePic);
      const { data: pathData } = storageBucket.getPublicUrl(imagePath);
      updatedData["profile_photo"] = pathData.publicUrl;
    }
    console.log("updatedData: ", updatedData);

    const { error } = await supabase
      .from("profiles")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      globalErrorHandler(error);
      return null;
    }
    return {
      ...record,
      profile_photo: updatedData.profile_photo || profile_photo,
    };
  } catch (error) {
    globalErrorHandler(error);
    return null;
  }
};

const create = async (record: {
  id: ProfileInfo["id"];
  email: ProfileInfo["email"];
}) => {
  const { id, email } = record;

  // Prepare the data to be inserted.
  const newData = {
    id,
    email,
  };

  // Insert a new row into the profiles table.
  const { data, error } = await supabase
    .from("profiles")
    .insert(newData)
    .single();

  if (error) {
    globalErrorHandler(error);
    return null;
  }
  return data;
};

const ProfileService = {
  upsert,
  create,
};

export default ProfileService;
