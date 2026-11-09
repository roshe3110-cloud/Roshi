import React from "react";

export interface MenuItem {
  title: string;
  href?: string;
  children?: MenuItem[];
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
  icon?: React.ComponentType<{ className?: string }>;
}
