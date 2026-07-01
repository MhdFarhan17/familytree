"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types";
import toast from "react-hot-toast";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function ContributorsTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const toggleBan = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(
        !currentStatus ? "User has been banned." : "User access restored.",
      );
      fetchProfiles();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading contributors...
      </div>
    );

  return (
    <div className="bg-card shadow-lg rounded-xl border border-border overflow-hidden animate-in fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground text-sm uppercase tracking-wider">
              <th className="p-4 font-bold">Name & Email</th>
              <th className="p-4 font-bold">Role</th>
              <th className="p-4 font-bold">Joined</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {profiles.map((profile) => (
              <tr
                key={profile.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  <div className="font-bold text-foreground">
                    {profile.full_name || "No Name"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {profile.email}
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold uppercase">
                    {profile.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {profile.is_banned ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-bold uppercase flex items-center w-fit">
                      <ShieldAlert className="w-3 h-3 mr-1" /> Suspended
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-bold uppercase flex items-center w-fit">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Active
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleBan(profile.id, profile.is_banned)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm active:scale-95 ${
                      profile.is_banned
                        ? "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white"
                        : "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    {profile.is_banned ? "Restore Access" : "Suspend Account"}
                  </button>
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-12 text-center text-muted-foreground font-medium"
                >
                  No contributors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
