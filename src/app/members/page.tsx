"use client";

import React, { useState } from "react";
import { useFamily } from "@/context/FamilyContext";
import { FamilyMember } from "@/types";
import DetailModal from "@/components/DetailModal";
import { useLanguage } from "@/context/LanguageContext";
import { Flower2, Search, User as UserIcon } from "lucide-react";

export default function MembersPage() {
  const { members } = useFamily();
  const { t } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter members by search query
  const filteredMembers = members.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.nickname.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group members logically (e.g. sort by birth date)
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const timeA = a.birth_date ? new Date(a.birth_date).getTime() : 0;
    const timeB = b.birth_date ? new Date(b.birth_date).getTime() : 0;
    return timeA - timeB;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">
            {t("membersList")}
          </h1>
          <p className="text-muted-foreground">{t("membersDesc")}</p>
        </div>
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder={t("searchMember")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-border hover:border-primary/50 focus:border-primary rounded-xl bg-card text-foreground focus:outline-none transition-colors shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sortedMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="group flex items-center bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="relative flex-shrink-0 mr-5">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.full_name}
                  className="w-14 h-14 rounded-full border-2 border-muted object-cover group-hover:border-primary/50 transition-colors"
                />
              ) : (
                <div className="w-14 h-14 rounded-full border-2 border-muted bg-muted flex items-center justify-center text-muted-foreground group-hover:border-primary/50 transition-colors">
                  <UserIcon className="w-7 h-7 opacity-50" />
                </div>
              )}
              {member.is_deceased || member.death_date ? (
                <div
                  className="absolute -bottom-1 -right-1 bg-slate-800 text-white rounded-full p-1 border-2 border-card"
                  title={t("deceased")}
                >
                  <Flower2 className="w-3 h-3" />
                </div>
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {member.full_name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {sortedMembers.length === 0 && (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border mt-6">
          <p className="text-muted-foreground text-lg font-medium">
            {t("noMembersFound")}
          </p>
        </div>
      )}

      <DetailModal
        member={selectedMember}
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
