import { Course, Chapter, UserProgress, Purchase } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

import { CourseProgress } from "@/components/course-progress";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

import CourseSidebarItem from "./course-sidebar-item";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const purchase = await db.purchase.findFirst({
    where: {
      userId: user.id!,
      courseId: course.id,
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-1">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10 ">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
