"use client";

import UserTable from "@/components/UserTable";
import { supabase } from "@/db/client";
import { UserColumnDefinition } from "@/types/TableTypes";
import { UserProfile } from "@/types/userTypes";
import { useQuery } from "@tanstack/react-query";

export default function page() {
  const fetchUsers = async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      throw new Error(error.message);
    }
    return data as UserProfile[];
  };

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<UserProfile[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

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
    <div className="grid gap-10 px-4">
      <div className="flex w-full justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">لیست کاربران</h1>
      </div>
      <UserTable
        isError={isError}
        isLoading={isLoading}
        error={error}
        users={users}
        headers={userTableHeaders}
      />
    </div>
  );
}
