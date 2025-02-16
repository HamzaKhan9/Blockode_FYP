import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/database";

const PROD_SUPABASE_BASE_URL = "https://mtzwzsxblhulourliqvr.supabase.co";
const PROD_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10end6c3hibGh1bG91cmxpcXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMyODYyMTcsImV4cCI6MjAxODg2MjIxN30.kZ-m0q9DslLQ5mG9KWu9Y1NUUXpcaeZdOd7asnn0-nM";
const DEV_SUPABASE_BASE_URL = "https://mtzwzsxblhulourliqvr.supabase.co";
const DEV_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10end6c3hibGh1bG91cmxpcXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMyODYyMTcsImV4cCI6MjAxODg2MjIxN30.kZ-m0q9DslLQ5mG9KWu9Y1NUUXpcaeZdOd7asnn0-nM";
export const ENV = import.meta.env.VITE_APP_ENV;

export const supabase = createClient<Database>(
  ENV == "prod" ? PROD_SUPABASE_BASE_URL : DEV_SUPABASE_BASE_URL,
  ENV == "prod" ? PROD_SUPABASE_KEY : DEV_SUPABASE_KEY
);
