import { UserButton } from "@clerk/nextjs";

export default function TopBar() {
  return (
    <div className="bg-[#3C8DBC] fixed top-0 w-full z-10 pl-0 flex  h-[50px] items-center shadow-none border-none ">
      <div className="fixed left-0 pl-2">
        <a
          href="/">
          <img
            src="/assets.png"
            alt="Assets logo"
            width="200"
            height="48"
            sizes="207px"
          />
        </a>
      </div>

      <div className="flex gap-4 pr-2 fixed right-0">
        <UserButton afterSwitchSessionUrl="/" />
      </div>
    </div>
  )
}
