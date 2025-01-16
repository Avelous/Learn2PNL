// app/api/video-upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { MediaConvertProcessor } from "@/lib/media-convert";

// Switch to Node.js runtime for AWS SDK compatibility
export const runtime = "nodejs";
export const maxDuration = 60; // 5 minutes
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;
    const chapterId = formData.get("chapterId") as string;

    if (!file || !courseId || !chapterId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Enhanced file validation
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const processor = new MediaConvertProcessor();

    // Get both URL and jobId from the processor
    const { url: videoUrl, jobId } = await processor.processVideo(
      buffer,
      courseId,
      chapterId
    );

    return NextResponse.json({
      videoUrl,
      jobId,
      status: "SUBMITTED",
      message: "Video processing started successfully",
    });
  } catch (error) {
    console.error("Error processing video:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse(
      JSON.stringify({
        error: errorMessage,
        message: "Error processing video. Please try again or contact support.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
