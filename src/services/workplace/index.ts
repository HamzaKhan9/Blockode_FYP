import { SERVICE_TYPES } from "../../constants/services";
import { SelectType, ServiceType } from "../../types/common";
import { globalErrorHandler } from "../../utils/errorHandler";
import { supabase } from "../supabase";

export const fetchService = async (
  service: string,
  type: SERVICE_TYPES
): Promise<SelectType[] | undefined> => {
  try {
    const res = await fetch(service);
    const json = await res.json();
    return responseResolver(type, json);
  } catch (error) {
    globalErrorHandler(error);
  }
};

const responseResolver = (
  type: SERVICE_TYPES,
  res: ServiceType[] | ServiceType
) => {
  switch (type) {
    case SERVICE_TYPES.WORKPLACES: {
      return res.map((r: any) => ({ value: r.domain, label: r.name, data: r }));
    }
    case SERVICE_TYPES.GOOGLE_PLACES: {
      return (res?.results || []).map((r: any) => ({
        value: r.formatted_address,
        label: r.formatted_address,
        data: r,
      }));
    }
  }
};

export const fetchInvitation = async (token: string) => {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .single();
  if (error) throw error;
  return data;
};
export const fetchInvitationWithRef = async (token: string) => {
  const { data, error } = await supabase
    .from("invitations")
    .select("*, account_id(id, workplace_logo)")
    .eq("token", token)
    .single();
  if (error) throw error;
  return data;
};

export const acceptInvitation = async (token: string) => {
  const { data, error } = await supabase.rpc("accept_invitation", {
    lookup_invitation_token: token,
  });
  if (error) throw error;
  return data;
};

export const updateRoleUsingInvitation = async ({
  role,
  userId,
  workplaceId,
}: {
  role: any;
  userId: string;
  workplaceId: string;
}) => {
  const { data, error } = await supabase
    .from("account_user")
    .update({ account_role: role })
    .eq("account_id", workplaceId)
    .eq("user_id", userId)
    .select("*");
  if (error) throw error;
  console.log(data);
  return data;
};

export const fetchWorkplace = async (id: string) => {
  const { data, error } = await supabase
    .from("workplaces")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};
