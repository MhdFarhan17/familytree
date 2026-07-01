import dagre from "dagre";
import { Node, Edge, Position } from "@xyflow/react";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Family tree layout specific settings
const nodeWidth = 250;
const nodeHeight = 100;
const marriageNodeWidth = 24;
const marriageNodeHeight = 24;

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB",
) => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    const w = node.type === "marriage" ? marriageNodeWidth : nodeWidth;
    const h = node.type === "marriage" ? marriageNodeHeight : nodeHeight;
    dagreGraph.setNode(node.id, { width: w, height: h });
  });

  edges.forEach((edge) => {
    if (edge.target.startsWith("marriage-")) {
      dagreGraph.setEdge(edge.source, edge.target, { weight: 100 });
    } else {
      dagreGraph.setEdge(edge.source, edge.target, { weight: 1 });
    }
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const w = node.type === "marriage" ? marriageNodeWidth : nodeWidth;
    const h = node.type === "marriage" ? marriageNodeHeight : nodeHeight;
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: nodeWithPosition.x - w / 2,
        y: nodeWithPosition.y - h / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
