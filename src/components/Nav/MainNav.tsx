"use client";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoBell, GoGift } from "react-icons/go";
import { FiSettings } from "react-icons/fi";
import { HiOutlineChatAlt } from "react-icons/hi";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import AuthDialogContent from "../AuthDialogContent";
import { useState } from "react";
import { IMAGE_LINKS } from "@/assets/imageLinks";
import { useAdminStore } from "@/stores/adminStore";
import { useCustomerCareStore } from "@/stores/customerCareStore";

const MainNav = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = useAdminStore((state) => state.logout);

  const adminZ = useAdminStore((state) => state.user);
  const customerCareZ = useCustomerCareStore((state) => state.user);
  const userAvatar =
    adminZ?.avatar?.url ||
    customerCareZ?.avatar?.url ||
    IMAGE_LINKS.DEFAULT_AVATAR;
    console.log('chekc act', userAvatar)
  const userFullName = adminZ
    ? `${adminZ.last_name} ${adminZ.first_name}`
    : `${customerCareZ?.last_name} ${customerCareZ?.first_name}`;
  return (
    <div className="jb w-full gap-4 py-8">
      <Link href={"/"}>
        <Avatar>
          <AvatarImage src="https://res.cloudinary.com/dpubnzap3/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1738821741/ic45aqy23c7ynle7yemv.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
      <Input
        type="email"
        placeholder="Search here..."
        className="bg-white flex-1"
      />
      <div className=" jb gap-8 ">
        <div className="jb gap-4 max-md:hidden">
          <div className="w-10 aspect-square rounded-xl relative cc bg-info-100 shadow-md shadow-info-300 hover-sd">
            <GoBell className="text-info-500" />
            <Badge
              className="absolute -top-1 -right-1 border-2 border-white text-[0.5rem] px-[0.14rem] py-[0.1rem] bg-info-500"
              variant="default"
            >
              12
            </Badge>
          </div>
          <div className="w-10 aspect-square rounded-xl relative cc bg-primary-100 shadow-md shadow-primary-300 hover-sd">
            <HiOutlineChatAlt className="text-primary-500" />
            <Badge
              className="absolute -top-1 -right-1 border-2 border-white text-[0.5rem] px-[0.14rem] py-[0.1rem] bg-primary-500"
              variant="default"
            >
              12
            </Badge>
          </div>
          <div
            onClick={() => router.push("/promotions")}
            className="w-10 aspect-square rounded-xl relative cc bg-success-100 shadow-md shadow-success-300 hover-sd cursor-pointer"
          >
            <GoGift className="text-success-700" />
            <Badge
              className="absolute -top-1 -right-1 border-2 border-white text-[0.5rem] px-[0.14rem] py-[0.1rem] bg-success-700"
              variant="default"
            >
              12
            </Badge>
          </div>
          <div className="w-10 aspect-square rounded-xl relative cc bg-danger-100 shadow-md shadow-danger-300 hover-sd">
            <FiSettings className="text-danger-500" />
            <Badge
              className="absolute -top-1 -right-1 border-2 border-white text-[0.5rem] px-[0.14rem] py-[0.1rem] bg-danger-500"
              variant="default"
            >
              12
            </Badge>
          </div>
        </div>
        <Separator
          orientation="vertical"
          className="bg-neutral-400 py-4 max-md:hidden"
        />
        <div className="jb gap-2">
          <h5 className="max-md:hidden">
            Hello, <span className="font-semibold">{userFullName}</span>
          </h5>
          <Popover>
            <PopoverTrigger asChild>
              <Avatar>
                <AvatarImage src={userAvatar} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => logout()}
                    variant={"ghost"}
                    className="text-red-300"
                  >
                    Logout
                  </Button>
                </DialogTrigger>
                <AuthDialogContent onClose={() => setOpen(false)} />
              </Dialog>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
