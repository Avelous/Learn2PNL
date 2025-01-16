"use client";

import {
  VideoIcon,
  Pencil,
  PlusCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import { useDropzone } from "react-dropzone";
import CustomVideoPlayer from "@/components/custom-video-player";
import { Progress } from "@/components/ui/progress";

// Processing states for better UX feedback
type ProcessingStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "complete"
  | "error";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
  playbackToken: string;
}

const acceptedTypes = {
  "video/*": [".mp4", ".mov", ".avi"],
};

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
  playbackToken,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const router = useRouter();

  const toggleEdit = () => {
    if (status === "uploading" || status === "processing") {
      return; // Prevent canceling during active upload/processing
    }
    setIsEditing((current) => !current);
    setStatus("idle");
    setProcessingProgress(0);
  };

  // Polling function for job status
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollStatus = async () => {
      if (!jobId || status !== "processing") return;

      try {
        const response = await axios.get(`/api/video-status?jobId=${jobId}`);
        const currentStatus = response.data.status;

        switch (currentStatus) {
          case "COMPLETE":
            setStatus("complete");
            setProcessingProgress(100);
            toast.success("Video processing completed!");
            router.refresh();
            break;
          case "ERROR":
            setStatus("error");
            toast.error("Video processing failed. Please try again.");
            break;
          case "PROGRESSING":
            // Simulate progress since MediaConvert doesn't provide exact progress
            setProcessingProgress((prev) => Math.min(prev + 5, 90));
            break;
        }
      } catch (error) {
        console.error("Error checking status:", error);
        // Don't set error status here - keep polling in case of temporary network issues
      }
    };

    if (status === "processing") {
      intervalId = setInterval(pollStatus, 10000); // Poll every 10 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, status, router]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setStatus("uploading");
    setProcessingProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", courseId);
      formData.append("chapterId", chapterId);

      const response = await axios.post("/api/video-upload", formData);
      const { videoUrl, jobId: newJobId } = response.data;

      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        videoUrl: videoUrl,
      });

      setJobId(newJobId);
      setStatus("processing");
      setProcessingProgress(20);

      toast.success("Video uploaded successfully and is now processing");
      router.refresh();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading video");
      setStatus("error");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 1,
    multiple: false,
    disabled: status === "uploading" || status === "processing",
  });

  const renderUploadProgress = () => {
    let statusText = "";
    let color = "";

    switch (status) {
      case "uploading":
        statusText = "Uploading your video...";
        color = "text-blue-700";
        break;
      case "processing":
        statusText = "Processing video... This may take a few minutes";
        color = "text-yellow-700";
        break;
      case "complete":
        statusText = "Processing complete!";
        color = "text-green-700";
        break;
      case "error":
        statusText = "Error processing video";
        color = "text-red-700";
        break;
    }

    return (
      <div className="mt-4 space-y-2">
        <Progress value={processingProgress} className="w-full" />
        <div className={`flex items-center gap-2 ${color}`}>
          {status === "complete" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <span className="text-sm font-medium">{statusText}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button
          variant="ghost"
          onClick={toggleEdit}
          disabled={status === "uploading" || status === "processing"}
        >
          {isEditing && "Cancel"}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <CustomVideoPlayer src={initialData.videoUrl} />
          </div>
        ))}

      {isEditing && (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center h-60 bg-slate-200 rounded-md cursor-pointer border-2 border-dashed border-slate-300 relative ${
            status === "uploading" || status === "processing"
              ? "opacity-50"
              : ""
          }`}
        >
          <input {...getInputProps()} />
          {status === "idle" ? (
            <>
              <VideoIcon className="h-10 w-10 text-slate-500" />
              <p className="text-sm text-slate-500 mt-2">
                Drag & drop or click to upload video
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 text-slate-500 animate-spin" />
              <p className="text-sm text-slate-500">
                Please wait while we process your video...
              </p>
            </div>
          )}
        </div>
      )}

      {(status === "uploading" || status === "processing") &&
        renderUploadProgress()}

      {initialData.videoUrl && !isEditing && status === "idle" && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
