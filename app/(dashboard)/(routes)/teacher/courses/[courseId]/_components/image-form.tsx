"use client";

import { ImageIcon, Pencil, PlusCircle, Loader2 } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

import { getPreSignedUrl } from "@/lib/s3";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
  fileType: "image" | "video" | "audio" | "pdf" | "all";
}

const acceptedTypes = {
  image: {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
  },
  video: {
    "video/*": [".mp4", ".mov", ".avi"],
  },
  audio: {
    "audio/*": [".mp3", ".wav", ".ogg"],
  },
  pdf: {
    "application/pdf": [".pdf"],
  },
  all: {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "video/*": [".mp4", ".mov", ".avi"],
    "audio/*": [".mp3", ".wav", ".ogg"],
    "application/pdf": [".pdf"],
  },
};

const ImageForm = ({ initialData, courseId, fileType }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      const { url, newFileName } = await getPreSignedUrl(
        file.name,
        file.type,
        courseId
      );

      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
      });

      const imageUrl = `${process.env.NEXT_PUBLIC_S3_URL}/${newFileName}`;

      await axios.patch(`/api/courses/${courseId}`, { imageUrl });

      toast.success("File uploaded successfully");
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
    accept: acceptedTypes[fileType],
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button variant="ghost" onClick={toggleEdit} disabled={isUploading}>
          {isEditing && "Cancel"}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
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
              <ImageIcon className="h-10 w-10 text-slate-500" />
              <p className="text-sm text-slate-500 mt-2">
                Drag & drop or click to upload
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageForm;
