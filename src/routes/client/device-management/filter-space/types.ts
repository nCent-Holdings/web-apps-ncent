export interface SpaceCheckBoxProps {
  name: string;
  isSpaceSelected: boolean;
}

export interface TreeNode {
  id: string;
  label: string;
  parentId: string | null;
  depth: number;
  children: TreeNode[];
  iconColor?: string;
  classNameCustomLabel?: string;
  classNameCustomContainer?: string;
}
