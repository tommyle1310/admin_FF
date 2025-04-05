"use client";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sideBarItems } from "@/utils/appData";
import { usePathname } from "next/navigation";
import { useState } from "react";

const styleSelectedItem =
  "bg-primary-200 relative after:absolute after:left-0 after:w-1 px-3 py-1 rounded-l-sm overflow-hidden after:top-0 after:h-full after:bg-primary-500 pl-4";
const styleHoverItem =
  "p-2 text-sm font-semibold hover:duration-200 hover:text-info-600 cursor-pointer hover:bg-info-100";

const SideBar = () => {
  const pathname = usePathname();
  const [selectedDropdownMenuTitle, setSelectedDropdownMenuTitle] =
    useState("");
  //   console.log("selectedDropdownMenuTitle", selectedDropdownMenuTitle);
  return (
    <div className=" min-h-screen bg-white fc py-4 pl-4 col-span-2">
      {sideBarItems.map((item, i) => {
        if (!item.dropdownItem)
          return (
            <Link
              href={item.link as string}
              key={i}
              className={
                pathname === item.link ? styleSelectedItem : styleHoverItem
              }
            >
              {item.title}
            </Link>
          );
        return (
          <div
            key={i}
            className={
              item.dropdownItem &&
              item.dropdownItem.some((item) => {
                return item.link === pathname;
              })
                ? styleSelectedItem
                : styleHoverItem
            }
          >
            <DropdownMenu>
              <DropdownMenuTrigger className="p-0  ring-0 outline-none text-start">
                {item.title}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                {item.dropdownItem?.map((item, i) => (
                  <DropdownMenuItem key={i}>
                    <Link
                      onClick={() =>
                        setSelectedDropdownMenuTitle(item.title as string)
                      }
                      href={item.link as string}
                    >
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
