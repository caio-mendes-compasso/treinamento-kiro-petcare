export type NavItem = {
  label: string;
  href: string;
  visibility: "public" | "authenticated";
  type: "link" | "button";
};

export type NavigationConfig = NavItem[];
