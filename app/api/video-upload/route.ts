import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { VideoProcessor } from "@/lib/video-processor";

// Increase the body size limit for the API route
export const runtime = "edge";
export const maxDuration = 300; // 5 minutes
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;
    const chapterId = formData.get("chapterId") as string;

    if (!file || !courseId || !chapterId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Add basic file validation
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return new NextResponse("File too large. Maximum size is 500MB", {
        status: 400,
      });
    }

    const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    if (!allowedTypes.includes(file.type)) {
      return new NextResponse(
        "Invalid file type. Please upload MP4, MOV, or AVI",
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process video and generate HLS streams
    const videoProcessor = new VideoProcessor();
    const hlsUrl = await videoProcessor.processVideo(
      buffer,
      courseId,
      chapterId
    );

    return NextResponse.json({ videoUrl: hlsUrl });
  } catch (error) {
    console.error("Error processing video:", error);
    return new NextResponse(
      "Error processing video. Please try again with a smaller file or contact support.",
      { status: 500 }
    );
  }
}
