"use client";

import { VideoIcon, Pencil, PlusCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import { useDropzone } from "react-dropzone";
import { getPreSignedUrl } from "@/lib/s3";
import MuxPlayer from "@mux/mux-player-react";
import CustomVideoPlayer from "@/components/custom-video-player";

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
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", courseId);
      formData.append("chapterId", chapterId);

      const response = await axios.post("/api/video-upload", formData);

      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        videoUrl: response.data.videoUrl,
      });

      toast.success("Video uploaded and processed successfully");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button variant="ghost" onClick={toggleEdit} disabled={isUploading}>
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
            {/* <MuxPlayer
              playbackId={initialData.muxData?.playbackId || ""}
              tokens={{
                playback: playbackToken,
              }}
              preferPlayback="mse"
            /> */}

            <CustomVideoPlayer src={initialData.videoUrl} />
          </div>
        ))}

      {isEditing && (
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center h-60 bg-slate-200 rounded-md cursor-pointer border-2 border-dashed border-slate-300 relative"
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-10 w-10 text-slate-500 animate-spin" />
              <p className="text-sm text-slate-500">Uploading...</p>
            </div>
          ) : (
            <>
              <VideoIcon className="h-10 w-10 text-slate-500" />
              <p className="text-sm text-slate-500 mt-2">
                Drag & drop or click to upload video
              </p>
            </>
          )}
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;
