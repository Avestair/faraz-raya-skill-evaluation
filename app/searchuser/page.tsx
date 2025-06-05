"use client";

import React, { useState, useEffect } from "react";
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
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  const searchResults = useSearchStore((state) => state.searchResults);
  const setSearchResults = useSearchStore((state) => state.setSearchResults);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [message, setMessage] = useState<string>(
    "نام و نام خانوادگی را برای سرچ وارد کنید",
  );

  useEffect(() => {
    console.log(fetchedUsers);

    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      console.log("devounced search term", debouncedSearchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const {
    data: fetchedUsers,
    isLoading: queryLoading,
    isError: queryIsError,
    error: queryError,
  } = useQuery<UserProfile[], Error>({
    queryKey: ["usersSearch", debouncedSearchTerm], //the fetch trigegrs the debouncedSearchTerm changes
    queryFn: async (): Promise<UserProfile[]> => {
      if (!debouncedSearchTerm.trim()) {
        return [];
      }
      const response = await fetch(
        `/api/proxy/users?full_name=${encodeURIComponent(debouncedSearchTerm.trim())}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // console.log("response", response);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "خطای ناشناخته در سرور" }));
        throw new Error(errorData.message || `خطای HTTP: ${response.status}`);
      }

      const data = await response.json();
      const result = z.array(userSchema).safeParse(data);

      if (result.success) {
        return result.data;
      } else {
        console.error("Validation errors from server:", result.error.format());
        throw new Error("فرمت داده نامعتبر از سرور دریافت شد.");
      }
    },
    enabled: !!debouncedSearchTerm.trim(),
  });

  // update local states loading, error, message and store
  useEffect(() => {
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
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto flex flex-col gap-4 px-8 md:flex-row"
      >
        <div className="flex gap-2 rounded-md border border-gray-300 dark:border-white dark:bg-stone-900">
          <input
            type="text"
            name="full_name"
            placeholder="نام و نام خانوادگی کاربر مورد نظر را وارد کنید..."
            className="w-[95%] border-0 p-2 text-gray-700 outline-none placeholder:text-sm dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PiMagnifyingGlassDuotone className="mt-1.5 ml-2 size-6 text-gray-400" />
        </div>
        <Button
          type="submit"
          disabled={queryLoading}
          onClick={() => setDebouncedSearchTerm(searchTerm)}
        >
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

      {searchResults !== null &&
        searchResults.length === 0 &&
        debouncedSearchTerm.trim() !== "" &&
        !queryLoading && (
          <p className="mt-4 text-center text-gray-500">هیچ کاربری یافت نشد</p>
        )}
    </div>
  );
}
