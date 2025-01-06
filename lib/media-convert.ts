import {
  MediaConvertClient,
  CreateJobCommand,
  GetJobCommand,
  DescribeEndpointsCommand,
  JobSettings,
  AudioDefaultSelection,
  OutputGroup,
  AacCodingMode,
  AacRawFormat,
  AacSpecification,
  H264QvbrSettings,
  H264SceneChangeDetect,
  H264ParControl,
  H264EntropyEncoding,
  H264AdaptiveQuantization,
  HlsStreamInfResolution,
  HlsSegmentControl,
  HlsManifestDurationFormat,
  HlsClientCache,
  HlsDirectoryStructure,
  HlsManifestCompression,
  HlsCaptionLanguageSetting,
  M3u8PcrControl,
  M3u8Settings,
  OutputGroupType,
} from "@aws-sdk/client-mediaconvert";
import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export class MediaConvertProcessor {
  private mediaConvert: MediaConvertClient;
  private s3: S3;
  private endpoint: string | undefined;

  constructor() {
    // Validate required environment variables
    this.validateEnvVariables();

    // Initialize S3 client
    this.s3 = new S3({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Initialize MediaConvert client
    this.mediaConvert = new MediaConvertClient({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  private validateEnvVariables() {
    const requiredVars = [
      "AWS_REGION",
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "S3_BUCKET",
      "MEDIACONVERT_ROLE_ARN",
      "MEDIACONVERT_QUEUE_ARN",
      "NEXT_PUBLIC_S3_URL",
    ];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
      }
    }
  }

  async processVideo(
    videoBuffer: Buffer,
    courseId: string,
    chapterId: string
  ): Promise<{ url: string; jobId: string }> {
    try {
      // First, upload the original video to S3
      const inputKey = `${courseId}/${chapterId}/original.mp4`;
      const outputPath = `${courseId}/${chapterId}/hls`;

      await this.uploadToS3(videoBuffer, inputKey);

      // Initialize MediaConvert endpoint
      await this.initializeEndpoint();

      // Create MediaConvert job
      const jobSettings = this.createJobSettings(
        `s3://${process.env.S3_BUCKET}/${inputKey}`,
        `s3://${process.env.S3_BUCKET}/${outputPath}`
      );

      const createJobCommand = new CreateJobCommand({
        Role: process.env.MEDIACONVERT_ROLE_ARN,
        Settings: jobSettings,
        StatusUpdateInterval: "SECONDS_60",
        Queue: process.env.MEDIACONVERT_QUEUE_ARN,
      });

      const job = await this.mediaConvert.send(createJobCommand);

      if (!job.Job?.Id) {
        throw new Error("Failed to create MediaConvert job");
      }

      return {
        url: `${process.env.NEXT_PUBLIC_S3_URL}/${outputPath}/original.m3u8`,
        jobId: job.Job.Id,
      };
    } catch (error) {
      console.error("Error in video processing:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Unknown error in video processing"
      );
    }
  }

  private async initializeEndpoint(): Promise<void> {
    if (!this.endpoint) {
      const command = new DescribeEndpointsCommand({});
      const response = await this.mediaConvert.send(command);
      this.endpoint = response.Endpoints?.[0].Url;

      if (!this.endpoint) {
        throw new Error("Failed to retrieve MediaConvert endpoint");
      }

      this.mediaConvert = new MediaConvertClient({
        region: process.env.AWS_REGION!,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        endpoint: this.endpoint,
      });
    }
  }

  private createJobSettings(
    inputPath: string,
    outputPath: string
  ): JobSettings {
    const outputGroup: OutputGroup = {
      Name: "HLS Output",
      OutputGroupSettings: {
        Type: OutputGroupType.HLS_GROUP_SETTINGS,
        HlsGroupSettings: {
          SegmentLength: 10,
          MinSegmentLength: 0,
          Destination: `${outputPath}/`,
          SegmentControl: HlsSegmentControl.SEGMENTED_FILES,
          ManifestDurationFormat: HlsManifestDurationFormat.INTEGER,
          OutputSelection: "MANIFESTS_AND_SEGMENTS",
          CaptionLanguageSetting: HlsCaptionLanguageSetting.OMIT,
          DirectoryStructure: HlsDirectoryStructure.SINGLE_DIRECTORY,
          ManifestCompression: HlsManifestCompression.NONE,
          ClientCache: HlsClientCache.ENABLED,
          StreamInfResolution: HlsStreamInfResolution.INCLUDE,
        },
      },
      Outputs: [
        // 720p output
        {
          NameModifier: "720p",
          OutputSettings: {
            HlsSettings: {
              SegmentModifier: "720p",
              AudioGroupId: "program_audio",
            },
          },
          ContainerSettings: {
            Container: "M3U8",
            M3u8Settings: {
              AudioFramesPerPes: 4,
              PcrControl: M3u8PcrControl.PCR_EVERY_PES_PACKET,
              PmtPid: 480,
              PrivateMetadataPid: 503,
              ProgramNumber: 1,
              PatInterval: 0,
              PmtInterval: 0,
              VideoPid: 481,
              AudioPids: [482, 483, 484, 485],
            } as M3u8Settings,
          },
          VideoDescription: {
            Width: 1280,
            Height: 720,
            CodecSettings: {
              Codec: "H_264",
              H264Settings: {
                MaxBitrate: 2800000,
                RateControlMode: "QVBR",
                QvbrSettings: {
                  QvbrQualityLevel: 8,
                } as H264QvbrSettings,
                SceneChangeDetect: H264SceneChangeDetect.TRANSITION_DETECTION,
                GopSize: 90,
                GopSizeUnits: "FRAMES",
                ParControl: H264ParControl.INITIALIZE_FROM_SOURCE,
                NumberReferenceFrames: 3,
                EntropyEncoding: H264EntropyEncoding.CABAC,
                Slices: 1,
                AdaptiveQuantization: H264AdaptiveQuantization.HIGH,
                SpatialAdaptiveQuantization: "ENABLED",
                TemporalAdaptiveQuantization: "ENABLED",
                Softness: 0,
              },
            },
          },
          AudioDescriptions: [
            {
              AudioSourceName: "Audio Selector 1",
              CodecSettings: {
                Codec: "AAC",
                AacSettings: {
                  Bitrate: 128000,
                  CodingMode: AacCodingMode.CODING_MODE_2_0,
                  SampleRate: 48000,
                  RawFormat: AacRawFormat.NONE,
                  Specification: AacSpecification.MPEG4,
                },
              },
            },
          ],
        },
        // 480p output
        {
          NameModifier: "480p",
          OutputSettings: {
            HlsSettings: {
              SegmentModifier: "480p",
              AudioGroupId: "program_audio",
            },
          },
          ContainerSettings: {
            Container: "M3U8",
            M3u8Settings: {
              AudioFramesPerPes: 4,
              PcrControl: M3u8PcrControl.PCR_EVERY_PES_PACKET,
              PmtPid: 480,
              PrivateMetadataPid: 503,
              ProgramNumber: 1,
              PatInterval: 0,
              PmtInterval: 0,
              VideoPid: 481,
              AudioPids: [482, 483, 484, 485],
            } as M3u8Settings,
          },
          VideoDescription: {
            Width: 854,
            Height: 480,
            CodecSettings: {
              Codec: "H_264",
              H264Settings: {
                MaxBitrate: 1400000,
                RateControlMode: "QVBR",
                QvbrSettings: {
                  QvbrQualityLevel: 7,
                } as H264QvbrSettings,
                SceneChangeDetect: H264SceneChangeDetect.TRANSITION_DETECTION,
                GopSize: 90,
                GopSizeUnits: "FRAMES",
                ParControl: H264ParControl.INITIALIZE_FROM_SOURCE,
                NumberReferenceFrames: 3,
                EntropyEncoding: H264EntropyEncoding.CABAC,
                Slices: 1,
                AdaptiveQuantization: H264AdaptiveQuantization.HIGH,
                SpatialAdaptiveQuantization: "ENABLED",
                TemporalAdaptiveQuantization: "ENABLED",
                Softness: 0,
              },
            },
          },
          AudioDescriptions: [
            {
              AudioSourceName: "Audio Selector 1",
              CodecSettings: {
                Codec: "AAC",
                AacSettings: {
                  Bitrate: 96000,
                  CodingMode: AacCodingMode.CODING_MODE_2_0,
                  SampleRate: 48000,
                  RawFormat: AacRawFormat.NONE,
                  Specification: AacSpecification.MPEG4,
                },
              },
            },
          ],
        },
      ],
    };

    return {
      TimecodeConfig: {
        Source: "ZEROBASED",
      },
      Inputs: [
        {
          FileInput: inputPath,
          AudioSelectors: {
            "Audio Selector 1": {
              DefaultSelection: AudioDefaultSelection.DEFAULT,
            },
          },
          VideoSelector: {},
          TimecodeSource: "ZEROBASED",
        },
      ],
      OutputGroups: [outputGroup],
    } as JobSettings;
  }

  private async uploadToS3(buffer: Buffer, key: string): Promise<void> {
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: "video/mp4",
      },
      queueSize: 4,
      partSize: 5 * 1024 * 1024, // 5MB chunks
    });

    try {
      await upload.done();
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload file to S3"
      );
    }
  }

  async checkJobStatus(jobId: string): Promise<string> {
    try {
      const command = new GetJobCommand({ Id: jobId });
      const response = await this.mediaConvert.send(command);
      return response.Job?.Status || "UNKNOWN";
    } catch (error) {
      console.error("Error checking job status:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to check job status"
      );
    }
  }
}
