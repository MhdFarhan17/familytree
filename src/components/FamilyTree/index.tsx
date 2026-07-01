"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CustomNode from "./CustomNode";
import MarriageNode from "./MarriageNode";
import { getLayoutedElements } from "../../utils/layout";
import { FamilyMember } from "../../types";
import { useFamily } from "@/context/FamilyContext";
import DetailModal from "../DetailModal";

const nodeTypes = {
  custom: CustomNode,
  marriage: MarriageNode,
};

export default function FamilyTree() {
  const { members } = useFamily();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null,
  );

  const handleNodeClick = useCallback((member: FamilyMember) => {
    setSelectedMember(member);
  }, []);

  useEffect(() => {
    const initialNodes: Node[] = [];
    const processed = new Set<string>();

    members.forEach((member) => {
      if (!processed.has(member.id)) {
        initialNodes.push({
          id: member.id,
          type: "custom",
          position: { x: 0, y: 0 },
          data: { member, onClick: handleNodeClick },
        });
        processed.add(member.id);

        if (member.spouse_id && !processed.has(member.spouse_id)) {
          const spouse = members.find((m) => m.id === member.spouse_id);
          if (spouse) {
            initialNodes.push({
              id: spouse.id,
              type: "custom",
              position: { x: 0, y: 0 },
              data: { member: spouse, onClick: handleNodeClick },
            });
            processed.add(spouse.id);
          }
        }
      }
    });

    const initialEdges: Edge[] = [];
    const marriages = new Map<string, { p1: string; p2: string }>();

    // Step 1: Identify all unique couples
    members.forEach((m) => {
      if (m.spouse_id) {
        const mId = [m.id, m.spouse_id].sort().join("-");
        marriages.set(mId, { p1: m.id, p2: m.spouse_id });
      }
      if (m.father_id && m.mother_id) {
        const mId = [m.father_id, m.mother_id].sort().join("-");
        marriages.set(mId, { p1: m.father_id, p2: m.mother_id });
      }
    });

    // Step 2: Create Marriage Nodes and Parent -> Marriage Edges
    marriages.forEach((couple, mId) => {
      const marriageNodeId = `marriage-${mId}`;
      initialNodes.push({
        id: marriageNodeId,
        type: "marriage",
        position: { x: 0, y: 0 },
        data: {},
      });

      initialEdges.push({
        id: `e-${couple.p1}-${marriageNodeId}`,
        source: couple.p1,
        target: marriageNodeId,
        type: "step",
        style: { stroke: "#64748b", strokeWidth: 2 },
      });
      initialEdges.push({
        id: `e-${couple.p2}-${marriageNodeId}`,
        source: couple.p2,
        target: marriageNodeId,
        type: "step",
        style: { stroke: "#64748b", strokeWidth: 2 },
      });
    });

    // Step 3: Connect Marriage Nodes (or single parents) to Children
    members.forEach((member) => {
      if (member.father_id && member.mother_id) {
        const mId = [member.father_id, member.mother_id].sort().join("-");
        const marriageNodeId = `marriage-${mId}`;
        initialEdges.push({
          id: `e-${marriageNodeId}-${member.id}`,
          source: marriageNodeId,
          target: member.id,
          type: "step",
          style: { stroke: "#64748b", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
        });
      } else if (member.father_id) {
        initialEdges.push({
          id: `e-${member.father_id}-${member.id}`,
          source: member.father_id,
          target: member.id,
          type: "step",
          style: { stroke: "#64748b", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
        });
      } else if (member.mother_id) {
        initialEdges.push({
          id: `e-${member.mother_id}-${member.id}`,
          source: member.mother_id,
          target: member.id,
          type: "step",
          style: { stroke: "#64748b", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
        });
      }
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [members, handleNodeClick, setNodes, setEdges]);

  return (
    <div className="absolute inset-0 bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        fitView
        minZoom={0.1}
        className="family-tree"
      >
        <Background color="var(--muted-foreground)" gap={24} size={2} />
        <Controls className="bg-card text-foreground border-border fill-foreground" />
      </ReactFlow>

      <DetailModal
        member={selectedMember}
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
