export type ComponentMeta = {
  locked: boolean;
  hidden: boolean;
  label: string;
  id?: string;
  parentId?: string;
};

export type ComponentNode = {
  id?: string;
  type: "component";
  name: string;
  meta: ComponentMeta;
  props: Record<string, any>;
  data: Record<string, any>;
  children?: PageTreeNode[];
};

export type RootNode = {
  id?: string;
  name: string;
  type: "root";
  children: PageTreeNode[];
};

export type PageTreeNode = RootNode | ComponentNode;
export type TreePath = number[];
export type PreviewMode = "mobile" | "tablet" | "desktop";
