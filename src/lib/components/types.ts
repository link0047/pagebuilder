export type ComponentMeta = {
  locked: boolean;
  hidden: boolean;
  label: string;
  id?: string;
  parentId?: string;
  slot?: string;
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

export type PageSettings = {
  spacing?: string;
  background?: string;
  padding?: { block?: string; inline?: string };
  font?: {
    family?: string;
    size?: string;
    weight?: string;
    lineHeight?: string;
  };
  maxWidth?: string;
};

export type PageHeading = {
  text?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "sm" | "md" | "lg";
  weight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
  alignment?: "left" | "center" | "right";
  color?: string;
  hidden?: boolean;
};

export type RootNode = {
  id?: string;
  name: string;
  type: "root";
  children: PageTreeNode[];
  settings?: PageSettings;
  heading?: PageHeading;
};

export type PageTreeNode = RootNode | ComponentNode;
export type TreePath = number[];
export type PreviewMode = "mobile" | "tablet" | "desktop";
export type MaybeElement = HTMLElement | null | undefined;
export type BuildType = "homepage" | "category" | "landing_page" | "custom";
export type PageSection = "page" | "heading";
