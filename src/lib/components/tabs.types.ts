export type TabsVariant = "underline" | "enclosed" | "outlined" | "filled";
export type TabsSize = "sm" | "md" | "lg";
export type TabsColor = "default" | "primary";
export type TabsShape = "default" | "square" | "pill";

export type TabsConfig = {
	variant: TabsVariant;
	size: TabsSize;
	color: TabsColor;
	shape: TabsShape;
	fullWidth: boolean;
};

export type Tab = {
	id: string;
	element: HTMLElement | null;
};