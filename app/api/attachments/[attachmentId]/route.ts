import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import db from "@/lib/db";

const s3 = new S3({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  req: Request,
  { params }: { params: { attachmentId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.findUnique({
      where: {
        id: params.attachmentId,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: attachment?.url.split(".com/")[1],
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("[ATTACHMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
