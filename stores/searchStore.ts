import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile } from "@/types/userTypes";

type SearchState = {
  searchTerm: string;
  searchResults: UserProfile[] | null;
};

type SearchActions = {
  setSearchTerm: (term: string) => void;
  setSearchResults: (results: UserProfile[] | null) => void;
  clearSearchState: () => void;
};

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
      name: "user-search-state", //name of the session storage
      storage: createJSONStorage(() => sessionStorage), // keep the search term and the serach result in the session storage
    },
  ),
);
