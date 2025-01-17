"use client";

import { UserRole } from "@prisma/client";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserButton } from "@/components/user-button";
import { useCurrentUser } from "@/hooks/use-current-user";

import SearchInput from "./search-input";
import { Button } from "./ui/button";

const NavbarRoutes = () => {
  const user = useCurrentUser();
  const pathName = usePathname();

  const isTeacherPage = pathName?.startsWith("/teacher");
  const isCoursePage = pathName?.includes("/courses");
  const isSearchPage = pathName === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : user?.role === UserRole.TEACHER ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher Mode
            </Button>
          </Link>
        ) : null}
        <UserButton />
      </div>
    </>
  );
};

export default NavbarRoutes;
