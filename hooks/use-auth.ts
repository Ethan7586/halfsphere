"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  tier: "free" | "pro";
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    tier: "free",
    loading: true,
  });
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      const user = error ? null : data.user;

      let tier: "free" | "pro" = "free";
      if (user) {
        const { data: tierData } = await supabase
          .from("user_tiers")
          .select("tier")
          .eq("user_id", user.id)
          .single();
        if (tierData?.tier === "pro") tier = "pro";
      }

      if (mounted) {
        setState({ user, tier, loading: false });
      }
    }

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          const user = session?.user ?? null;
          setState((prev) => ({ ...prev, user }));
          // refetch tier when auth state changes
          if (user) {
            supabase
              .from("user_tiers")
              .select("tier")
              .eq("user_id", user.id)
              .single()
              .then(({ data }) => {
                if (mounted && data?.tier) {
                  setState((prev) => ({
                    ...prev,
                    tier: data.tier as "free" | "pro",
                  }));
                }
              });
          }
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({ user: null, tier: "free", loading: false });
    window.location.href = "/login";
  };

  return { ...state, signOut };
}
