import { redirect } from "next/navigation";

import { getProgress } from "@/actions/course/get-progress";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

import CourseNavbar from "./_components/course-navbar";
import CourseSidebar from "./_components/course-sidebar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    courseId: string;
  };
}) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              id: user.id!,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress(user.id!, course.id);

  return (
    <div className="h-full">
      <div className="h-[60px] md:pl-80 fixed inset-y-0 z-50 w-full">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[60px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
