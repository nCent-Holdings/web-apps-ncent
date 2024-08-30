interface Node {
  id: string;
  parentId: string | null;
  depth: number;
  children: Node[];
}

export const findRootParent = (nodes: Node[], nodeId: string): string | null => {
  const findRecursive = (node: Node): string | null => {
    if (node.id === nodeId) {
      return node.id;
    }

    for (const child of node.children) {
      const result = findRecursive(child);
      if (result) {
        return result;
      }
    }

    return null;
  };

  let rootParentId: string | null = null;

  for (const item of nodes) {
    const result = findRecursive(item);
    if (result) {
      rootParentId = item.id;
      break;
    }
  }

  return rootParentId;
};
