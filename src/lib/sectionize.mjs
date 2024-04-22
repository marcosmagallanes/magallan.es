import { findAfter } from "unist-util-find-after";
import { visit } from "unist-util-visit";

const MAX_HEADING_DEPTH = 6;

function plugin() {
  return transform;
}

function transform(tree) {
  visit(tree, "thematicBreak", sectionize);
}

function sectionize(node, index, parent) {
  const start = node;
  const startIndex = index;

  const isEnd = (node) =>
    node.type === "thematicBreak" || node.type === "export";
  const end = findAfter(parent, start, isEnd);
  const endIndex = parent.children.indexOf(end);

  const between = parent.children.slice(
    startIndex + 1,
    endIndex > 0 ? endIndex : undefined,
  );

  const section = {
    type: "section",
    children: [
      {
        type: "div",
        children: between,
        data: {
          hName: "div",
          hProperties: {
            class: "slide",
          },
        },
      },
    ],
    data: {
      hName: "section",
      hProperties: {
        class: "slide-wrapper",
      },
    },
  };

  parent.children.splice(
    startIndex,
    section.children[0].children.length + 1,
    section,
  );
}

export default plugin;
