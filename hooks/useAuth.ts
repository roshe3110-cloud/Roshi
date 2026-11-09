import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ================================
// QUERY KEYS
// ================================

export const authKeys = {
  user: ["auth", "user"] as const,

  session: ["auth", "session"] as const,
};

// ================================
// GET CURRENT USER
// ================================

export function useUser() {
  return useQuery({
    queryKey: authKeys.user,

    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;

      return data.user;
    },
  });
}

// ================================
// GET SESSION
// ================================

export function useSession() {
  return useQuery({
    queryKey: authKeys.session,

    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      return data.session;
    },
  });
}

// ================================
// SIGN UP
// ================================

export function useSignUp() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,

        password,
      });

      if (error) throw error;

      return data;
    },
  });
}

// ================================
// SIGN IN
// ================================

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,

        password,
      });

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authKeys.user,
      });

      queryClient.invalidateQueries({
        queryKey: authKeys.session,
      });
    },
  });
}

// ================================
// SIGN OUT
// ================================

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: authKeys.user,
      });

      queryClient.removeQueries({
        queryKey: authKeys.session,
      });
    },
  });
}
