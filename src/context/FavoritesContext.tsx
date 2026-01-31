import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import supabase from "@/lib/supabaseClient";

interface FavoritesContextValue {
  user: User | null;
  favorites: string[];
  loading: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<{ error?: string } | void>;
  refreshFavorites: () => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(
    async (uid: string) => {
      setLoading(true);
      const { data, error } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("favorites fetch error", error);
        setFavorites([]);
      } else {
        setFavorites((data ?? []).map((row) => row.product_id));
      }
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error("supabase user error", error);
      }
      setUser(data?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    fetchFavorites(user.id);
  }, [user, fetchFavorites]);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!user) {
        return { error: "LOGIN_REQUIRED" };
      }

      const currentlyFavorite = favorites.includes(productId);
      setFavorites((prev) =>
        currentlyFavorite ? prev.filter((id) => id !== productId) : [productId, ...prev.filter((id) => id !== productId)],
      );

      const action = currentlyFavorite
        ? supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId)
        : supabase.from("favorites").insert({ user_id: user.id, product_id: productId });

      const { error } = await action;
      if (error) {
        console.error("favorites toggle error", error);
        await fetchFavorites(user.id);
        return { error: error.message };
      }
    },
    [favorites, user, fetchFavorites],
  );

  const value = useMemo(
    () => ({
      user,
      favorites,
      loading,
      isFavorite,
      toggleFavorite,
      refreshFavorites: async () => {
        if (user) {
          await fetchFavorites(user.id);
        }
      },
    }),
    [user, favorites, loading, isFavorite, toggleFavorite, fetchFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

