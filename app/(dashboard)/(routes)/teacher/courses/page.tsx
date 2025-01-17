import { redirect } from "next/navigation";

import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const CoursePage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const { id: userId } = user;

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursePage;
