"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { SidebarContextType } from "@/types/SideBarTypes";

const SidebarContext = createContext<SidebarContextType>({
  isSidebarOpen: false,
  toggleSidebar: () => {
    console.warn("toggleSidebar called without a SidebarProvider");
  },
  openSidebar: () => {
    console.warn("openSidebar called without a SidebarProvider");
  },
  closeSidebar: () => {
    console.warn("closeSidebar called without a SidebarProvider");
  },
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  //make side bar a menu from 970px break point
  useEffect(() => {
    const getInitialSidebarState = () => {
      const mdBreakpoint = 970;
      return window.innerWidth >= mdBreakpoint;
    };

    setIsSidebarOpen(getInitialSidebarState());

    const handleResize = () => {
      setIsSidebarOpen(getInitialSidebarState());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
