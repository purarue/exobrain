// generates a unix-tree like structure

import path from "node:path";

function createTree(files: any[]): any {
  const tree: any = {};

  files.forEach((file: any) => {
    let slug = file.slug;
    if (!slug.startsWith("/")) {
      slug = "/" + slug;
    }
    const parts = slug.split(path.sep);
    let currentLevel = tree;

    parts.forEach((part: any, index: number) => {
      currentLevel[part] = currentLevel[part] || {};

      if (index === parts.length - 1) {
        // Last part, mark it as a file
        currentLevel[part].isFile = true;
        currentLevel[part].data = file;
      }

      currentLevel = currentLevel[part];
    });
  });

  return tree;
}

interface Line {
  text: string;
  name?: string;
  data?: any;
}

function walkTree(tree: any, indent = ""): Line[] {
  const lines: Line[] = [];

  Object.keys(tree).forEach((item, index, array) => {
    const isLast = index === array.length - 1;
    const prefix = indent + (isLast ? "└── " : "├── ");

    if (tree[item].isFile) {
      lines.push({
        text: `${prefix}`,
        name: item,
        data: tree[item].data,
      });
    } else {
      if (item === "") {
        lines.push({
          text: "notes/",
        });
      } else {
        lines.push({
          text: `${prefix}${item}/`,
        });
      }
    }

    if (!tree[item].isFile) {
      const nestedLines = walkTree(
        tree[item],
        // TODO: these spaces dont actually work because of HTML rendering
        // use some other character or add some CSS?
        // gets to be real confusing though, might just leave it as is
        indent + (isLast ? "    " : "│   "),
      );
      lines.push(...nestedLines);
    }
  });

  return lines;
}

export { createTree, walkTree };
