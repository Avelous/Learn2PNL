import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import db from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { title } = await req.json();

    if (!user || user.role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId: user.id!,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
