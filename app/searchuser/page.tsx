"use client";

import React, { useState, useEffect, useRef } from "react";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { UserProfile, userSchema } from "@/types/userTypes";
import { z } from "zod";
import UserTable from "@/components/UserTable";
import { UserColumnDefinition } from "@/types/TableTypes";
import SkeletonTable from "@/ui/SkeletonTable";
import { Button } from "@/ui/Button";

export default function UserSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [message, setMessage] = useState<string>();

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const performSearch = async (term: string) => {
    setLoading(true);
    setError(null);
    setSearchResults(null);
    setMessage("در حال جست و جو");

    if (!term.trim()) {
      setError(new Error("Please enter a search term."));
      setMessage("لطفا نام و نام خانوادگی وارد کنید.");
      setLoading(false);
      return;
    }

    try {
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
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data = await response.json();

      const result = z.array(userSchema).safeParse(data);
      if (result.success) {
        setSearchResults(result.data);
        setMessage(
          result.data.length > 0
            ? ` ${result.data.length} کاربر بیدا شد`
            : "هیچ کاربری یافت نشد",
        );
      } else {
        console.error("Validation errors:", result.error.format());
        setSearchResults([]);
        setError(new Error("Invalid data format received from server."));
        setMessage("جست و جو ناموفق بود");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchTerm.trim()) {
      debounceTimeoutRef.current = setTimeout(() => {
        performSearch(searchTerm);
      }, 500);
    } else {
      setSearchResults(null);
      setError(null);
      setMessage("نام و نام خانوادگی را برای سرچ وارد کنید");
      setLoading(false);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

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
        <div className="flex gap-2 rounded-md border border-gray-300 dark:border-white">
          <input
            type="text"
            name="full_name"
            placeholder="نام و نام خانوادگی کاربر مورد نظر را وارد کنید..."
            className="w-[95%] border-0 p-2 text-gray-700 outline-none placeholder:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <PiMagnifyingGlassDuotone className="mt-1.5 ml-2 size-6 text-gray-400" />
        </div>
        <Button type="submit">جست و جو</Button>
      </form>

      <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
        {message}
      </p>
      {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}

      {/* search result table */}
      {loading && searchTerm.trim() !== "" ? (
        <SkeletonTable headers={userTableHeaders} rowCount={5} />
      ) : (
        searchResults &&
        searchResults.length > 0 && (
          <UserTable
            users={searchResults}
            isError={error != null}
            isLoading={loading}
            error={error}
            headers={userTableHeaders}
          />
        )
      )}

      {/* {searchResults &&
        searchResults.length === 0 &&
        searchTerm.trim() !== "" &&
        !loading && (
          <p className="mt-4 text-center text-gray-500">هیچ کاربری بیدا نشد</p>
        )} */}
    </div>
  );
}
