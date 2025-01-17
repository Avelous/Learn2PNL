"use client";

import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { getPreSignedUrl } from "@/lib/s3";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const acceptedTypes = {
  "application/*": [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip"],
  "image/*": [".png", ".jpg", ".jpeg", ".gif"],
  "audio/*": [".mp3", ".wav", ".ogg"],
};

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
        `${courseId}/attachments`
      );

      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
      });

      const fileUrl = `${process.env.NEXT_PUBLIC_S3_URL}/${newFileName}`;

      await axios.post(`/api/courses/${courseId}/attachments`, {
        url: fileUrl,
        name: file.name,
      });

      toast.success("File uploaded");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
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
        Course attachments
        <Button variant="ghost" onClick={toggleEdit} disabled={isUploading}>
          {isEditing && "Cancel"}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id ? (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

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
              <File className="h-10 w-10 text-slate-500" />
              <p className="text-sm text-slate-500 mt-2">
                Drag & drop or click to upload file
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
