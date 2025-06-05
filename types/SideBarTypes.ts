export type SubMenuItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export type SidebarContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};

export type SideBarElementProps = {
  title: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
  subMenuItems?: SubMenuItem[];
  hasSubMenu?: boolean;
  isNotLink?: boolean;
  onClick?: () => void;
};

export type SubMenuProps = {
  subMenuItems?: SubMenuItem[];
  className?: string;
};

export type SubMenuElementProps = {
  title: string;
  href: string;
  className?: string;
};
