import React from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (user?.role !== UserRole.ADMIN) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
