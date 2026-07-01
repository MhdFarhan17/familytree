import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Heart } from "lucide-react";

export default function MarriageNode() {
  return (
    <div className="flex items-center justify-center w-6 h-6 bg-card border-2 border-pink-500 rounded-full shadow-sm z-0">
      <Heart className="w-3 h-3 text-pink-500 fill-pink-500/20" />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1 !h-1 !bg-transparent !border-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-1 !h-1 !bg-transparent !border-none"
      />
    </div>
  );
}
