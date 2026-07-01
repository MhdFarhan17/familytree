"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ActivityLog, Profile } from "@/types";
import { Clock, Plus, Edit2, Trash2 } from "lucide-react";

export default function LogsTab() {
  const [logs, setLogs] = useState<(ActivityLog & { profiles: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data, error } = await supabase
          .from("activity_logs")
          .select("*, profiles(full_name, email)")
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        setLogs(data as any);
      } catch (error) {
        console.error("Failed to load logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading logs...
      </div>
    );

  const getActionIcon = (action: string) => {
    switch (action) {
      case "ADD":
        return (
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <Plus className="w-4 h-4" />
          </div>
        );
      case "EDIT":
        return (
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <Edit2 className="w-4 h-4" />
          </div>
        );
      case "DELETE":
        return (
          <div className="bg-red-100 text-red-600 p-2 rounded-full">
            <Trash2 className="w-4 h-4" />
          </div>
        );
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    if (action === "ADD") return "text-green-600";
    if (action === "EDIT") return "text-blue-600";
    return "text-red-600";
  };

  return (
    <div className="bg-card shadow-lg rounded-xl border border-border p-6 animate-in fade-in">
      <h2 className="text-xl font-bold mb-6 flex items-center text-foreground">
        <Clock className="w-6 h-6 mr-2 text-primary" /> Activity Logs
      </h2>

      <div className="space-y-6">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex gap-4 border-b border-border pb-6 last:border-b-0 last:pb-0"
          >
            <div className="flex-shrink-0 mt-1">
              {getActionIcon(log.action)}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                <p className="font-medium text-foreground">
                  <span className="font-bold">
                    {log.profiles?.full_name || "Admin"}
                  </span>{" "}
                  performed a{" "}
                  <span className={`font-bold ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>{" "}
                  action
                </p>
                <span className="text-xs text-muted-foreground flex items-center">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-foreground/80 mb-2">
                Target:{" "}
                <span className="font-bold px-2 py-0.5 bg-muted rounded text-xs">
                  {log.target_member_name}
                </span>
              </p>
              {log.details && (
                <div className="bg-muted/50 p-3 rounded-lg text-xs font-mono text-muted-foreground overflow-x-auto border border-border/50">
                  {log.details}
                </div>
              )}
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No recent activity.
          </div>
        )}
      </div>
    </div>
  );
}
