import React from "react";
import { Handle, Position } from "@xyflow/react";
import { User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { FamilyMember } from "../../types";

interface CustomNodeProps {
  data: {
    member: FamilyMember;
    onClick: (member: FamilyMember) => void;
  };
}

export default function CustomNode({ data }: CustomNodeProps) {
  const { member, onClick } = data;
  const { t } = useLanguage();

  // Extract birth year for brief display
  const birthYear = member.birth_date ? member.birth_date.split("-")[0] : "?";

  return (
    <div
      className={`bg-card border-2 rounded-xl shadow-lg w-[250px] overflow-hidden cursor-pointer transition-all duration-300 group relative
        ${member.gender === "male" ? "border-blue-500 shadow-blue-500/20 hover:border-blue-400 hover:shadow-blue-500/40" : "border-pink-500 shadow-pink-500/20 hover:border-pink-400 hover:shadow-pink-500/40"} 
        hover:-translate-y-1
      `}
      onClick={() => onClick(member)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted-foreground w-3 h-3"
      />

      <div className="flex items-center p-3 gap-4 relative">
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${member.gender === "male" ? "bg-blue-500" : "bg-pink-500"}`}
        ></div>
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.nickname}
            className={`w-16 h-16 rounded-full border-2 object-cover shadow-sm bg-muted ${member.gender === "male" ? "border-blue-500" : "border-pink-500"}`}
          />
        ) : (
          <div
            className={`w-16 h-16 rounded-full border-2 shadow-sm flex items-center justify-center ${member.gender === "male" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-500" : "border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-500"}`}
          >
            <User className="w-8 h-8" />
          </div>
        )}
        <div className="flex flex-col z-10 w-full pr-2">
          <div className="flex items-center justify-between">
            <span
              className="font-bold text-foreground text-lg truncate"
              title={member.full_name}
            >
              {member.nickname}
            </span>
            {(member.is_deceased || member.death_date) && (
              <span
                className="bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-1 flex-shrink-0"
                title={t("deceased")}
              >
                {t("deceasedShort")}
              </span>
            )}
          </div>
          <span className="text-sm text-muted-foreground font-medium mt-0.5">
            b. {birthYear}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted-foreground w-3 h-3"
      />
    </div>
  );
}
