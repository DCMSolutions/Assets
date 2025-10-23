import { UserButton } from "@clerk/nextjs";

export default function TopBar() {
  return (
    <div className="bg-[#3C8DBC] fixed top-0 w-full z-10 pl-0 flex flex-row-reverse h-[50px] items-center shadow-none border-none ">
      <div className="flex gap-4 pr-1">
        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </div>
  )
}
