import React, { useState } from "react";
import Modal from "@/ui/Modal";
import { UserProfile, userSchema } from "@/types/userTypes";
import { Button } from "@/ui/Button";
import Input from "@/ui/Input";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UserProfileDetailModalProps {
  user: UserProfile;
  onClose: () => void;
}

export default function UserProfileDetailModal({
  user,
  onClose,
}: UserProfileDetailModalProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfile>();

  let updatedUser: UserProfile;

  // compare the intial user object and create a new object with updated parts
  function createUpdatedUser(
    initialUser: UserProfile,
    submittedData: Partial<UserProfile>,
  ): UserProfile {
    const updatedUser: UserProfile = { ...initialUser };
    for (const key in submittedData) {
      const field = key as keyof UserProfile;
      if (field in initialUser && submittedData[field] !== initialUser[field]) {
        // @ts-ignore - for optional fields
        updatedUser[field] = submittedData[field] ?? null;
      }
    }
    return updatedUser;
  }

  //make the new user obejct and call the nextjs api
  function onSubmit(data: UserProfile) {
    updatedUser = createUpdatedUser(user, data);
    console.log("updated user", updatedUser);
    refetch();
  }

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "داده ای وجود ندارد";
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  //** Alerts it would be better to use fetch or a something simple like axios here because react query is good to use for a list of data or a data that you want to keep, but updated user data is neither of those types and it just making the code more dirty and complex. i just used it here for demonstration purposes.

  async function updateUserDetail(user: UserProfile): Promise<UserProfile> {
    const requestBody: UserProfile = {
      ...user,
      username: user.username, //search for the record with the username
    };

    try {
      const response = await fetch("/api/proxy/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);

      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("اطلاعات کاربر با موفقیت تغییر کرد!");
      onClose();
      const validationResult = userSchema.safeParse(data?.[0]);

      if (!validationResult.success) {
        throw new Error("Invalid user data received from server");
      }

      return validationResult.data;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error?.message : "Something went wrong",
      );
    }
  }

  async function deleteUser(username: string) {
    console.log("from the compoentn :", username);

    try {
      const response = await fetch(
        `/api/proxy/users?username=${encodeURIComponent(username)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} - ${error?.message}`);
      }
      // const data = await response.json();  //no need for this as delete returns nothing
      // console.log("data", data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("کاربر با موفقیت حذف شد!");
      onClose();
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "something went wrong",
      );
    }
  }

  const {
    data: fetchedUserData, //not going to be used
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserProfile, Error>({
    queryKey: ["editedUser", user.id],
    queryFn: () => updateUserDetail(updatedUser),
    enabled: false,
  });

  const userDetails = [
    { label: "نام و نام خانوادگی", value: user.full_name },
    { label: "ایمیل", value: user.email },
    { label: "نام کاربری", value: user.username },
    { label: "عنوان شعلی", value: user.job_title },
    { label: "شرکت", value: user.company },
    { label: "دبارتمان", value: user.department || "داده وجود ندارد" },
    { label: "بیو", value: user.bio || "داده ای وجود ندارد" },
    { label: "تاریخ ثبت نام", value: formatDate(user.created_at) },
    {
      label: "آخرین ورود",
      value: formatDate(user.last_sign_in_at) || "داده ای وجود ندارد",
    },
  ];

  type FormFields = {
    full_name: string;
    username: string;
    email: string;
    job_title: string;
    company?: string;
    department?: string;
    bio?: string;
  };

  const formFields = [
    {
      id: "full_name" as const,
      label: "نام و نام خانوادگی",
      type: "text",
      required: true,
      errorMessage: "نام و نام خانوادگی اجباری است!",
    },
    {
      id: "username" as const,
      label: "نام کاربری",
      type: "text",
      required: true,
      errorMessage: "نام کاربری اجباری است!",
    },
    {
      id: "email" as const,
      label: "ایمیل",
      type: "email",
      required: true,
      errorMessage: "ایمیل اجباری است!",
    },
    {
      id: "job_title" as const,
      label: "عنوان شغلی",
      type: "text",
      required: true,
      errorMessage: "عنوان شغلی اجباری است!",
    },
    {
      id: "company" as const,
      label: "شرکت",
      type: "text",
      required: false,
    },
    {
      id: "department" as const,
      label: "دپارتمان",
      type: "text",
      required: false,
    },
    {
      id: "bio" as const,
      label: "بیوگرافی",
      type: "text",
      required: false,
    },
  ] satisfies Array<{
    id: keyof FormFields;
    label: string;
    type: string;
    required: boolean;
    errorMessage?: string;
  }>;

  return (
    <Modal onClose={onClose}>
      <Modal.Header
        title={`اطلاعات کاربر : ${user.full_name || user.email}`}
        description={`شما در حال مشاهده اطلاعات ${user.full_name} هستید.`}
      />

      <Modal.Body className="grid text-gray-700 dark:text-gray-300">
        {/* switch state of the modal between edit mode and view user detail mode */}
        <div className="mb-4 flex w-full justify-center gap-4">
          <button
            onClick={() => setShowEditForm(false)}
            className="cursor-pointer underline underline-offset-2"
          >
            اطلاعات کاربر
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="cursor-pointer underline underline-offset-2"
          >
            ویرایش
          </button>
        </div>

        {/* user deatil section */}
        {!showEditForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {userDetails.map((detail, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
                  {detail.label}
                </h3>
                <p className="mt-1 text-xs break-words sm:text-sm">
                  {detail.value || "داده وجود ندارد"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* edit user detail section */}
        {showEditForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {formFields.map((field) => (
              <div key={field.id} className="grid gap-1">
                <label htmlFor={field.id}>{field.label}</label>
                <Input
                  readOnly={field.id === "username"}
                  defaultValue={user?.[field.id] ?? undefined}
                  type={field.type}
                  {...register(field.id, { required: field.required })}
                />
                {errors[field.id] && field.required && (
                  <p className="text-xs text-red-500 md:text-sm">
                    {field.errorMessage}
                  </p>
                )}
              </div>
            ))}

            {isError ? (
              <div className="grid gap-1">
                <Button type="submit">ارسال مجدد</Button>
                <p className="text-center text-sm text-red-600">
                  {error.message}
                </p>
              </div>
            ) : isLoading ? (
              <Button className="flex justify-center gap-2">
                <div className="mt-1 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                <p>در حال ذخیره</p>
              </Button>
            ) : (
              <Button type="submit">تایید و ذخیره</Button>
            )}
          </form>
        )}
      </Modal.Body>

      <Modal.Footer className="flex w-full justify-between">
        <Button onClick={onClose} className="px-4 py-2">
          بستن
        </Button>
        <Button onClick={() => deleteUser(user.username)} variant="danger">
          حذف
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
