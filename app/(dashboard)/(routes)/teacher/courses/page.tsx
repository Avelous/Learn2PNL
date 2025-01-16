import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";

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
