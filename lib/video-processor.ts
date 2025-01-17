import { NextRequest, NextResponse } from "next/server";

import { MediaConvertProcessor } from "@/lib/media-convert";

import { currentUser } from "./auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const jobId = req.nextUrl.searchParams.get("jobId");
    if (!jobId) {
      return new NextResponse("Missing jobId parameter", { status: 400 });
    }

    const processor = new MediaConvertProcessor();
    const status = await processor.checkJobStatus(jobId);

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Error checking video status:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new NextResponse(
      JSON.stringify({
        error: errorMessage,
        message:
          "Error checking video status. Please try again or contact support.",
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
