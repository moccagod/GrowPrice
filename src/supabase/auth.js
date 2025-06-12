// src/lib/auth.js
import { supabase } from "client";

export const isLoggedIn = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
