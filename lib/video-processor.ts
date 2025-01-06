import ffmpeg from "fluent-ffmpeg";
import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "node:fs";
import path from "node:path";

// Initialize S3 with extended timeout and proper configuration
const s3 = new S3({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  requestHandler: {
    // Extend timeout to 30 minutes
    timeout: 1800000,
  },
});

// Quality presets for different resolutions
const QUALITY_PRESETS = [
  { resolution: "720p", bitrate: "2800k", width: 1280, height: 720 },
  { resolution: "480p", bitrate: "1400k", width: 854, height: 480 },
  { resolution: "360p", bitrate: "800k", width: 640, height: 360 },
];

export class VideoProcessor {
  private readonly tmpDir: string;

  constructor() {
    // Create temporary directory for processing
    this.tmpDir = path.join("/tmp", "video-processing");
    if (!fs.existsSync(this.tmpDir)) {
      fs.mkdirSync(this.tmpDir, { recursive: true });
    }
  }

  async processVideo(
    inputBuffer: Buffer,
    courseId: string,
    chapterId: string
  ): Promise<string> {
    console.log("Starting video processing...");

    const inputPath = path.join(this.tmpDir, "input.mp4");
    const outputDir = path.join(this.tmpDir, "output");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write input buffer to temporary file
    fs.writeFileSync(inputPath, inputBuffer);
    console.log("Input file written successfully");

    try {
      // Generate HLS segments for each quality preset
      console.log("Starting HLS generation...");
      await Promise.all(
        QUALITY_PRESETS.map((preset) =>
          this.generateHLSStream(inputPath, outputDir, preset)
        )
      );
      console.log("HLS generation completed");

      // Generate master playlist
      const masterPlaylist = this.generateMasterPlaylist();
      fs.writeFileSync(path.join(outputDir, "master.m3u8"), masterPlaylist);
      console.log("Master playlist generated");

      // Upload all generated files to S3
      const s3BasePath = `${courseId}/${chapterId}`;
      await this.uploadToS3(outputDir, s3BasePath);
      console.log("Upload completed successfully");

      // Clean up temporary files
      fs.rmSync(this.tmpDir, { recursive: true, force: true });

      return `${process.env.NEXT_PUBLIC_S3_URL}/${s3BasePath}/master.m3u8`;
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(this.tmpDir)) {
        fs.rmSync(this.tmpDir, { recursive: true, force: true });
      }
      throw error;
    }
  }

  private async generateHLSStream(
    inputPath: string,
    outputDir: string,
    preset: (typeof QUALITY_PRESETS)[0]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          "-c:v h264",
          "-c:a aac",
          "-ar 48000",
          `-b:v ${preset.bitrate}`,
          `-maxrate ${preset.bitrate}`,
          `-bufsize ${parseInt(preset.bitrate) * 2}k`,
          `-vf scale=${preset.width}:${preset.height}`,
          "-hls_time 10",
          "-hls_list_size 0",
          "-hls_segment_filename",
          `${outputDir}/${preset.resolution}_%03d.ts`,
          "-f hls",
        ])
        .output(`${outputDir}/${preset.resolution}.m3u8`)
        .on("end", () => {
          // Properly type the callback to match ffmpeg's expected types
          resolve();
        })
        .on("error", (err: Error) => {
          reject(err);
        })
        .run();
    });
  }

  private generateMasterPlaylist(): string {
    let playlist = "#EXTM3U\n";
    playlist += "#EXT-X-VERSION:3\n";

    QUALITY_PRESETS.forEach((preset) => {
      playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${
        parseInt(preset.bitrate) * 1000
      },RESOLUTION=${preset.width}x${preset.height}\n`;
      playlist += `${preset.resolution}.m3u8\n`;
    });

    return playlist;
  }

  private async uploadToS3(
    localDir: string,
    s3BasePath: string
  ): Promise<void> {
    const files = fs.readdirSync(localDir);

    // Upload files in smaller batches to prevent timeout
    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (file) => {
          const fileContent = fs.readFileSync(path.join(localDir, file));
          const contentType = file.endsWith(".m3u8")
            ? "application/x-mpegURL"
            : "video/MP2T";

          // Use multipart upload for larger files
          const upload = new Upload({
            client: s3,
            params: {
              Bucket: process.env.S3_BUCKET!,
              Key: `${s3BasePath}/${file}`,
              Body: fileContent,
              ContentType: contentType,
            },
            queueSize: 4, // number of concurrent uploads
            partSize: 5 * 1024 * 1024, // 5MB part size
          });

          try {
            await upload.done();
          } catch (error) {
            console.error(`Error uploading ${file}:`, error);
            throw error;
          }
        })
      );
    }
  }
}
