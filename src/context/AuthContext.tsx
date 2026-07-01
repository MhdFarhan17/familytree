"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Role } from "../types";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  login: (role: Role, supabaseUser?: any) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const isAdmin = localStorage.getItem("family-tree-auth-admin");

      if (isAdmin === "true") {
        setUser({ id: "admin-123", email: "admin@local", role: "admin" });
      } else if (session?.user) {
        // Fetch profile for role and banned status
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile?.is_banned) {
          await supabase.auth.signOut();
          toast.error("Akun Anda telah ditangguhkan oleh Admin.");
          setUser(null);
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            role: profile?.role || "contributor",
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const isAdmin = localStorage.getItem("family-tree-auth-admin");
      if (isAdmin === "true") return;

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile?.is_banned) {
          await supabase.auth.signOut();
          setUser(null);
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            role: profile?.role || "contributor",
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Protect Dashboard Route
  useEffect(() => {
    if (!isLoading && pathname.startsWith("/admin") && !user) {
      router.push("/login");
    }
  }, [user, pathname, router, isLoading]);

  const login = (role: Role, supabaseUser?: any) => {
    if (role === "admin") {
      setUser({ id: "admin-123", email: "admin@local", role: "admin" });
      localStorage.setItem("family-tree-auth-admin", "true");
      router.push("/admin");
    } else if (supabaseUser) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        role: "contributor",
      });
      router.push("/");
    }
  };

  const logout = async () => {
    if (user?.role === "admin") {
      localStorage.removeItem("family-tree-auth-admin");
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
