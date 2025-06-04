import Card from "@/ui/Card";
import Link from "next/link";
import { PiUserDuotone, PiUserListDuotone } from "react-icons/pi";

export default function DashBoard() {
  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold md:text-2xl">خوش آمدید!</h1>
      <div className="md:flex grid gap-2.5 px-2 md:gap-5">
        <Link href={"/users"}>
          <Card bodyClassName="grid gap-4 md:w-[200px] w-full">
            <PiUserListDuotone className="size-6" />
            <p className="justify-self-end">کاربران</p>
          </Card>
        </Link>

        <Link href={"/searchuser"}>
          <Card bodyClassName="grid gap-4 md:w-[200px] w-full">
            <PiUserDuotone className="size-6" />
            <p className="justify-self-end">جست و جوی کاربر</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
