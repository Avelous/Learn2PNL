import { UserRole } from "@prisma/client";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { currentUser } from "@/lib/auth";

const f = createUploadthing();

const handleAuth = async () => {
  const user = await currentUser();
  const isAuthorized = user?.role === UserRole.TEACHER;

  if (!user || !isAuthorized) throw new Error("Unauthorized");
  const id = user?.id;
  return { id };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
