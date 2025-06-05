import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile } from "@/types/userTypes";

interface SearchState {
  searchTerm: string;
  searchResults: UserProfile[] | null;
}

interface SearchActions {
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: UserProfile[] | null) => void;
  clearSearchState: () => void;
}

type SearchStore = SearchState & SearchActions;

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      searchTerm: "",
      searchResults: null,

      setSearchTerm: (term) => set({ searchTerm: term }),
      setSearchResults: (results) => set({ searchResults: results }),
      clearSearchState: () => set({ searchTerm: "", searchResults: null }),
    }),
    {
      name: "user-search-state",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
