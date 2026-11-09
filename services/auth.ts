import { createClient } from "@/lib/supabase/client";

// ================================
// SIGN IN ADMIN
// ================================
// export async function signInAdmin(email: string, password: string) {
//   const supabase = createClient();
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//   if (error) throw error;

//   // Validate admin role from app_metadata
//   const role = data.user?.app_metadata?.role as string | undefined;
//   const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL; // optional client-side check

//   const isAdmin = role === "admin" || (adminEmail && data.user?.email === adminEmail);

//   if (!isAdmin) {
//     // Sign out immediately so the session isn't kept
//     await supabase.auth.signOut();
//     throw new Error("Access denied. This account does not have admin privileges.");
//   }

//   return data;
// }


export async function signInAdmin(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  const isAdmin = data.user?.app_metadata?.admin === true;

  if (!isAdmin) {
    await supabase.auth.signOut();
    throw new Error("Access denied. This account does not have admin privileges.");
  }

  return data;
}

// ================================
// SIGN OUT
// ================================
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ================================
// GET CURRENT USER (CLIENT)
// ================================
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}
