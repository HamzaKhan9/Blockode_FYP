import { Database } from "./database";

export type TableKey = keyof Database["public"]["Tables"];
export type TableRow<T extends TableKey> =
  Database["public"]["Tables"][T]["Row"];

export type WorkPlaceAutocomplete = {
  name: string;
  domain: string;
  logo: string;
};

export type GooglePlaces = {
  formatted_address: string;
  location: {
    lat: any;
    lng: any;
  };
};

export type SelectType = { value: string; label: string };

export type ServiceType = WorkPlaceAutocomplete | GooglePlaces | any;
