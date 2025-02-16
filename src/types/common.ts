import { Database } from "./database";

export type TableKey = keyof Database["public"]["Tables"];
export type TableRow<T extends TableKey> =
  Database["public"]["Tables"][T]["Row"];
