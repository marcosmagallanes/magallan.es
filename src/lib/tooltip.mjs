import { visit } from "unist-util-visit";

function plugin() {
  return transform;
}

function transform(tree) {
  visit(tree, "heading", wrapTooltip);
}

function wrapTooltip(node, index, parent) {
  if (node.depth === 1) {
    const tooltipNode = findTooltipNode(parent.children, index);

    if (tooltipNode) {
      const tooltipContent = tooltipNode.children
        .map((child) => child.value)
        .join("\n");

      const tooltipWrapper = {
        type: "div",
        data: {
          hName: "div",
          hProperties: {
            class: "tooltip-wrapper",
          },
        },
        children: [
          node,
          {
            type: "span",
            data: {
              hName: "span",
              hProperties: {
                class: "tooltip",
              },
            },
            children: [
              {
                type: "text",
                value: tooltipContent,
              },
            ],
          },
        ],
      };

      parent.children.splice(index, 2, tooltipWrapper);
    }
  }
}

function findTooltipNode(nodes, headingIndex) {
  const startIndex = headingIndex + 1;
  const endIndex = nodes.findIndex(
    (node, index) =>
      index > startIndex && (node.type === "heading" || node.type === "export"),
  );

  const tooltipNode = nodes[startIndex];

  if (
    tooltipNode &&
    tooltipNode.type === "containerDirective" &&
    tooltipNode.name === "tooltip"
  ) {
    return tooltipNode;
  }

  return null;
}

export default plugin;
