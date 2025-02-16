import { SERVICE_TYPES } from "../../constants/services";
import { SelectType, ServiceType } from "../../types/common";
import { globalErrorHandler } from "../../utils/errorHandler";

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
