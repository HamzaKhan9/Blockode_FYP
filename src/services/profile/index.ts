import { TableRow } from "../../types/common";
import { globalErrorHandler } from "../../utils/errorHandler";
import { supabase } from "../supabase";

export type ProfileInfo = TableRow<"profiles">;

// workplace: ProfileInfo["workplace"];
const upsert = async (record: {
  id: ProfileInfo["id"];
  profile_photo: ProfileInfo["profile_photo"];
  name: ProfileInfo["name"];
  newProfilePic?: File | null;
}) => {
  const { id, newProfilePic, profile_photo, name } = record;

  const storageBucket = supabase.storage.from("default");
  if (profile_photo && newProfilePic) {
    const prevTimeStamp = profile_photo.match(/-(\d+)\.png$/)![1];
    await storageBucket.remove([`${id}/profileAvatar-${prevTimeStamp}.png`]);
  }

  const updatedData: Partial<ProfileInfo> = {
    name: name,
    // workplace: workplace,
  };

  if (newProfilePic) {
    const imagePath = `${id}/profileAvatar-${Date.now()}.png`;
    await storageBucket.upload(imagePath, newProfilePic);
    const { data: pathData } = storageBucket.getPublicUrl(imagePath);
    updatedData["profile_photo"] = pathData.publicUrl;
  }

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
};

const fetch = async (id?: string) => {
  if (id) {
    const { data, error } = await supabase
      .from("profiles")
      .select(`*, game_info(*)`)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  } else return null;
};

const fetch_workplace = async (id: string) => {
  const { data, error } = await supabase
    .from("workplaces")
    .select("workplace_domain, workplace_name")
    .eq("id", id);
  if (error) {
    return globalErrorHandler(error);
  }
  return data?.[0];
};

const save_profile = async (body: any) => {
  const { data, error } = await supabase.functions.invoke("save-profile", {
    body: JSON.stringify(body),
  });
  if (error) {
    throw error;
  }
  return data?.data?.[0];
};

const save_workplace = async (body: any) => {
  const { data, error } = await supabase.functions.invoke("save-workplace", {
    body,
  });
  if (error) {
    throw error;
  }
  return data?.data?.[0];
};
const fetch_places = async (body: any) => {
  const { data, error } = await supabase.functions.invoke("google-places", {
    body,
  });
  if (error) {
    throw error;
  }
  return data?.data?.results || [];
};

const search_companies = async (body: any) => {
  const { data, error } = await supabase.functions.invoke("search-companies", {
    body,
  });
  if (error) {
    throw error;
  }
  return data || [];
};
const ProfileService = {
  upsert,
  fetch_workplace,
  save_profile,
  save_workplace,
  fetch_places,
  search_companies,
  fetch,
};

export default ProfileService;
