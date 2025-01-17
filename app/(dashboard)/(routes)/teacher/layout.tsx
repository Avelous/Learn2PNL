import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

import { currentUser } from "@/lib/auth";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  if (user?.role !== UserRole.TEACHER) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
