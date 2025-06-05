"use client";
import React, { useState, useMemo } from "react";
import { UserProfile } from "@/types/userTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/Table";
import SkeletonTable from "@/ui/SkeletonTable";
import UserProfileDetailModal from "@/components/modals/userModal";
import { AnimatePresence } from "motion/react";
import { formatDate } from "@/utils/utils";
import { UserColumnDefinition, UserTableProps } from "@/types/TableTypes";

function truncateString(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

export default function UserTable({
  headers,
  users,
  isLoading,
  isError,
  error,
}: UserTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("all");

  // handle Modal display function that belongs to the modal
  function toggleModal() {
    setShowModal(!showModal);
    if (showModal) {
      setSelectedUser(null);
    }
  }

  //fucntion for handling modal to get the user data and then set it to a state and pass it to the modal
  function handleOnClick(user: UserProfile) {
    setShowModal(true);
    setSelectedUser(user);
  }

  // Handle sorting logic
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // sort user array data based on the job title
  const uniqueJobTitles = useMemo(() => {
    if (!users) return [];
    const titles = new Set<string>();
    users.forEach((user) => {
      if (user.job_title) {
        titles.add(user.job_title);
      }
    });
    return ["all", ...Array.from(titles).sort()];
  }, [users]);

  //sort by given seacrh type
  const sortedAndFilteredUsers = useMemo(() => {
    if (!users) return [];

    let filtered = users;

    if (jobTitleFilter !== "all") {
      filtered = filtered.filter((user) => user.job_title === jobTitleFilter);
    }

    if (sortColumn) {
      filtered.sort((a, b) => {
        let valA: number | string | null | undefined;
        let valB: number | string | null | undefined;

        if (sortColumn === "index") {
          valA = users.indexOf(a);
          valB = users.indexOf(b);
        } else if (sortColumn === "created_at") {
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
        } else {
          valA = a[sortColumn as keyof UserProfile];
          valB = b[sortColumn as keyof UserProfile];
        }

        // Handle null/undefined values for sorting
        if (valA === null || valA === undefined) valA = "";
        if (valB === null || valB === undefined) valB = "";

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [users, jobTitleFilter, sortColumn, sortDirection]);

  //users table headers
  const userTableHeaders: UserColumnDefinition[] = [
    { headerName: "ردیف", dataKey: "index", className: "", sortable: true },
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

  if (isLoading) {
    return <SkeletonTable headers={userTableHeaders} rowCount={7} />;
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-red-500">
        Error: {error?.message || "Failed to fetch users"}
      </div>
    );
  }

  if (!users) {
    return <div className="py-8 text-center">هیچ کاربری بیدا نشد.</div>;
  }

  return (
    <>
      <div className="mb-4 grid items-center gap-4 md:flex">
        <label
          htmlFor="jobTitleFilter"
          className="text-gray-700 dark:text-gray-300"
        >
          فیلتر عنوان شغلی:
        </label>
        <select
          id="jobTitleFilter"
          value={jobTitleFilter}
          onChange={(e) => setJobTitleFilter(e.target.value)}
          className="rounded-md border border-gray-300 bg-white py-2 text-gray-900 outline-none focus:ring focus:ring-black dark:border-gray-600 dark:bg-stone-700 dark:text-white dark:focus:ring-white"
        >
          {uniqueJobTitles.map((title) => (
            <option key={title} value={title}>
              {title === "all" ? "همه" : title}
            </option>
          ))}
        </select>
      </div>

      <Table className="min-w-full">
        <TableHead>
          <TableRow className="flex w-full">
            {/* map over the headers */}
            {headers.map((header, index) => (
              <TableHeader
                key={index}
                className={`min-w-[70px] flex-1 px-4 py-3 text-right md:min-w-[100] ${header.className} ${header.sortable ? "cursor-pointer select-none" : ""}`}
                onClick={
                  header.sortable
                    ? () => handleSort(header.dataKey as string)
                    : undefined
                  //  pass the onclick function if the header is sortable
                }
              >
                <div className="flex items-center gap-1">
                  {header.headerName}
                  {/* display a arrow icon based on the sort state */}
                  {header.sortable && sortColumn === header.dataKey && (
                    <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </div>
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedAndFilteredUsers.map((user) => (
            <TableRow key={user.id} className="flex w-full">
              {headers.map((column, colIndex) => (
                <TableCell
                  key={`${user.id}-${colIndex}`}
                  className={`${column.className} min-w-[70px] flex-1 px-4 py-3 text-right md:min-w-[100]`}
                >
                  {column.dataKey === "index" && users.indexOf(user) + 1}{" "}
                  {column.dataKey === "full_name" &&
                    truncateString(user.full_name, 14)}
                  {column.dataKey === "username" && user.username}
                  {column.dataKey === "company" &&
                    (user.company
                      ? truncateString(user.company, 14)
                      : "شرکتی وارد نشده")}
                  {column.dataKey === "job_title" &&
                    truncateString(user.job_title, 14)}
                  {column.dataKey === "created_at" &&
                    formatDate(user.created_at)}
                  {column.dataKey === "actions" && (
                    <button
                      className="cursor-pointer text-inherit underline underline-offset-2"
                      onClick={() => handleOnClick(user)}
                    >
                      جزییات
                    </button>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* add motion animation for the modal */}
      <AnimatePresence>
        {/* user detial modal */}
        {showModal && selectedUser && (
          <UserProfileDetailModal user={selectedUser} onClose={toggleModal} />
        )}
      </AnimatePresence>
    </>
  );
}
