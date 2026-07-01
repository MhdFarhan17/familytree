"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FamilyMember } from "../types";
import { supabase } from "@/lib/supabase";

interface FamilyContextType {
  members: FamilyMember[];
  loading: boolean;
  updateMember: (
    id: string,
    updatedData: Partial<FamilyMember>,
  ) => Promise<void>;
  addMember: (member: Omit<FamilyMember, "id" | "created_at">) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching members:", error);
        return;
      }

      // Convert database format to our frontend format if needed
      if (data) {
        setMembers(data as FamilyMember[]);
      }
    } catch (error) {
      console.error("Exception fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const updateMember = async (
    id: string,
    updatedData: Partial<FamilyMember>,
  ) => {
    try {
      // Optimistic update
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m)),
      );

      const { error } = await supabase
        .from("family_members")
        .update(updatedData)
        .eq("id", id);

      if (error) throw error;

      // LOGGING
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from("activity_logs").insert({
          user_id: session.user.id,
          action: "EDIT",
          target_member_id: id,
          target_member_name: updatedData.full_name || "Member",
          details: JSON.stringify(updatedData),
        });
      }
    } catch (error) {
      console.error("Error updating member:", error);
      fetchMembers(); // Revert on error
      throw error;
    }
  };

  const addMember = async (memberData: Omit<FamilyMember, "id">) => {
    try {
      const { id, ...dataToInsert } = memberData as any;

      const { data, error } = await supabase
        .from("family_members")
        .insert([dataToInsert])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newMember = data[0] as FamilyMember;
        setMembers((prev) => [...prev, newMember]);

        // LOGGING
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from("activity_logs").insert({
            user_id: session.user.id,
            action: "ADD",
            target_member_id: newMember.id,
            target_member_name: newMember.full_name,
            details: JSON.stringify(dataToInsert),
          });
        }
      }
    } catch (error: any) {
      console.error("Error adding member:", error);
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const memberToDelete = members.find((m) => m.id === id);

      // Optimistic update
      setMembers((prev) => prev.filter((m) => m.id !== id));

      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // LOGGING
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user && memberToDelete) {
        await supabase.from("activity_logs").insert({
          user_id: session.user.id,
          action: "DELETE",
          target_member_id: id,
          target_member_name: memberToDelete.full_name,
          details: "Deleted completely",
        });
      }
    } catch (error: any) {
      console.error("Error deleting member:", error);
      fetchMembers(); // Revert on error
      throw error;
    }
  };

  return (
    <FamilyContext.Provider
      value={{ members, loading, updateMember, addMember, deleteMember }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
}
