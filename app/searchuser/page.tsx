"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { UserProfile, userSchema } from "@/types/userTypes";
import { z } from "zod";
import UserTable from "@/components/UserTable";
import { UserColumnDefinition } from "@/types/TableTypes";
import SkeletonTable from "@/ui/SkeletonTable";
import { Button } from "@/ui/Button";
import { useSearchStore } from "@/stores/searchStore";
import { useQuery } from "@tanstack/react-query";

export default function UserSearchPage() {
  // Accesses and updates search term and results from Zustand store (sessionStorage)
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  const searchResults = useSearchStore((state) => state.searchResults);
  const setSearchResults = useSearchStore((state) => state.setSearchResults);

  // Manages loading, error, and message states for UI feedback
  const [message, setMessage] = useState<string>(
    "نام و نام خانوادگی را برای سرچ وارد کنید",
  );

  // Local state for the debounced search term that triggers the React Query
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  // Ref to hold the debounce timeout ID
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Defines the asynchronous function that performs the search API call
  const performSearch = useCallback(
    async (term: string) => {
      setSearchResults(null);
      setMessage("در حال جست و جو");

      if (!term.trim()) {
        setMessage("لطفا نام و نام خانوادگی وارد کنید.");
        setSearchResults(null);
        return []; // Returns empty array if no term, preventing API call if enabled
      }

      try {
        // API call to the proxy for user search
        const response = await fetch(
          `/api/proxy/users?full_name=${encodeURIComponent(term.trim())}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "خطای ناشناخته در سرور" }));
          throw new Error(errorData.message || `خطای HTTP: ${response.status}`);
        }

        const data = await response.json();
        // Zod validation of the received data
        const result = z.array(userSchema).safeParse(data);

        if (result.success) {
          setSearchResults(result.data); // Updates search results in Zustand store
          setMessage(
            result.data.length > 0
              ? ` ${result.data.length} کاربر پیدا شد`
              : "هیچ کاربری یافت نشد",
          );
          return result.data; // Returns data for useQuery
        } else {
          console.error("Validation errors:", result.error.format());
          setSearchResults([]); // Clears search results in store on validation failure
          setMessage("جست و جو ناموفق بود");
          return []; // Returns empty array on validation failure
        }
      } catch (err: unknown) {
        setSearchResults(null); // Clears search results in store on API error
        setMessage(
          `جست و جو ناموفق بود: ${err instanceof Error ? err.message : String(err)}`,
        );
        throw err; // Re-throws to let useQuery handle the error state
      }
    },
    [setSearchResults], // Depends on setSearchResults from Zustand
  );

  // Debounce effect to update debouncedSearchTerm
  useEffect(() => {
    // Clears any existing debounce timer
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Sets a new timer if searchTerm is not empty
    if (searchTerm.trim()) {
      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm); // Updates debounced term after 500ms
      }, 500);
    } else {
      // Resets states if searchTerm is empty
      setDebouncedSearchTerm(""); // Clears debounced term
      setSearchResults(null); // Clears search results in store
      setMessage("نام و نام خانوادگی را برای سرچ وارد کنید");
    }

    // Cleanup function for the effect
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]); // Effect re-runs when searchTerm changes

  // React Query hook for data fetching
  const {
    data: fetchedUsers,
    isLoading: queryLoading,
    isError: queryIsError,
    error: queryError,
  } = useQuery<UserProfile[], Error>({
    queryKey: ["usersSearch", debouncedSearchTerm], // Query key changes with debounced term, triggering fetch
    queryFn: () => performSearch(debouncedSearchTerm), // The function to execute for the query
    enabled: !!debouncedSearchTerm.trim(), // Query is enabled only when debounced term is not empty
  });

  // Effect to synchronize component states with React Query's fetch status
  useEffect(() => {
    // Updates UI states based on query results
    if (fetchedUsers !== undefined && !queryLoading && !queryIsError) {
      setSearchResults(fetchedUsers);
      if (fetchedUsers.length > 0) {
        setMessage(`${fetchedUsers.length} کاربر پیدا شد.`);
      } else {
        setMessage("هیچ کاربری یافت نشد.");
      }
    } else if (queryLoading) {
      if (debouncedSearchTerm.trim()) {
        setMessage("در حال جست و جو...");
      } else {
        setMessage("نام و نام خانوادگی را برای سرچ وارد کنید");
        setSearchResults(null);
      }
    } else if (queryIsError) {
      setMessage(
        `جست و جو ناموفق بود: ${queryError?.message || "خطای نامشخص."}`,
      );
      setSearchResults(null);
    } else if (!debouncedSearchTerm.trim()) {
      setMessage("نام و نام خانوادگی را برای سرچ وارد کنید");
      setSearchResults(null);
    }
  }, [
    debouncedSearchTerm,
    fetchedUsers,
    queryLoading,
    queryIsError,
    queryError,
    setSearchResults,
  ]);

  // Defines table headers for the UserTable component
  const userTableHeaders: UserColumnDefinition[] = [
    { headerName: "ردیف", dataKey: "index", className: "" },
    { headerName: "نام کامل", dataKey: "full_name", className: "" },
    {
      headerName: "نام کاربری",
      dataKey: "username",
      className: "hidden sm:table-cell",
    },
    {
      headerName: "شرکت",
      dataKey: "company",
      className: "hidden md:table-cell",
    },
    {
      headerName: "عنوان شغلی",
      dataKey: "job_title",
      className: "hidden lg:table-cell",
    },
    {
      headerName: "تاریخ ثبت نام",
      dataKey: "created_at",
      className: "hidden xl:table-cell",
      sortable: true,
    },
    { headerName: "عملیات", dataKey: "actions", className: "" },
  ];

  return (
    <div className="group mt-44 grid w-full gap-8 transition-all duration-500 focus-within:mt-4 md:gap-10">
      <h1 className="text-xl font-semibold md:text-2xl">
        جست و جوی کاربران با نام و نام خانوادگی
      </h1>
      <form
        onSubmit={(e) => e.preventDefault()} // Prevents default browser form submission
        className="mx-auto flex flex-col gap-4 px-8 md:flex-row"
      >
        <div className="flex gap-2 rounded-md border border-gray-300 dark:border-white dark:bg-stone-900">
          <input
            type="text"
            name="full_name"
            placeholder="نام و نام خانوادگی کاربر مورد نظر را وارد کنید..."
            className="w-[95%] border-0 p-2 text-gray-700 outline-none placeholder:text-sm dark:text-gray-200"
            value={searchTerm} // Controls input value via Zustand state
            onChange={(e) => setSearchTerm(e.target.value)} // Updates searchTerm in Zustand store
          />
          <PiMagnifyingGlassDuotone className="mt-1.5 ml-2 size-6 text-gray-400" />
        </div>
        <Button type="submit" disabled={queryLoading}>
          {queryLoading ? "در حال جست و جو" : "جست و جو"}
        </Button>
      </form>

      <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
        {message}
      </p>
      {queryIsError && (
        <p className="mt-2 text-sm text-red-500">
          {queryError?.message || "خطایی رخ داد"}
        </p>
      )}
      {/* Renders skeleton table during loading, or the actual table if search results exist */}
      {queryLoading && debouncedSearchTerm.trim() ? (
        <SkeletonTable headers={userTableHeaders} rowCount={5} />
      ) : (
        searchResults !== null &&
        searchResults.length > 0 && (
          <UserTable
            users={searchResults}
            isError={queryIsError}
            isLoading={queryLoading}
            error={queryError}
            headers={userTableHeaders}
          />
        )
      )}

      {/* Displays a message if no search results are found for a non-empty search term */}
      {searchResults !== null &&
        searchResults.length === 0 &&
        debouncedSearchTerm.trim() !== "" &&
        !queryLoading && (
          <p className="mt-4 text-center text-gray-500">هیچ کاربری یافت نشد</p>
        )}
    </div>
  );
}
