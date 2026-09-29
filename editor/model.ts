export type ViewportMode = "desktop" | "mobile";
export type ElementType = "text" | "image" | "youtube" | "button" | "line" | "component";

export type ViewportSize = {
  width: number;
  height: number;
};

export type ElementLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  visible: boolean;
};

export type AnimationTrigger = "page-enter" | "hover" | "loop";
export type AnimationPreset = "none" | "fade" | "fade-up" | "slide-left" | "slide-right" | "scale" | "spin";

export type AnimationSpec = {
  preset: AnimationPreset;
  duration: number;
  delay: number;
  easing: string;
  trigger: AnimationTrigger;
};

export type SiteElement = {
  id: string;
  type: ElementType;
  name: string;
  content: string;
  desktop: ElementLayout;
  mobile: ElementLayout;
  style?: Record<string, string | number>;
  animation?: AnimationSpec;
};

export type SitePage = {
  id: string;
  name: string;
  viewport: Record<ViewportMode, ViewportSize>;
  overflow: "hidden" | "visible";
  background: string;
  elements: SiteElement[];
};

export type SiteProject = {
  id: string;
  name: string;
  pages: SitePage[];
};
