import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SidebarState = {
  isOpen: boolean;
};

type SidebarActions = {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
};

type SidebarStore = SidebarState & SidebarActions;

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      //intial state
      isOpen: true,
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setSidebarOpen: (open: boolean) => set({ isOpen: open }),
    }),
    {
      name: "sidebar-state",
      storage: createJSONStorage(() => localStorage), //keep the user preference in the local storage
      partialize: (state) => ({ isOpen: state.isOpen }), //keep only the state in the local storage
    },
  ),
);
