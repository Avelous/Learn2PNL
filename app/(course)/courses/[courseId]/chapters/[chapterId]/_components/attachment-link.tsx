"use client"
import { useState } from "react";
import axios from "axios";
import { File } from "lucide-react";
import toast from "react-hot-toast";

interface AttachmentLinkProps {
  id: string;
  name: string;
}

export const AttachmentLink = ({ id, name }: AttachmentLinkProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/attachments/${id}`);
      window.open(response.data.url, "_blank");
    } catch (error) {
      toast.error("Error accessing attachment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline text-xs disabled:opacity-50"
    >
      <File className="h-4 w-4 mr-2" />
      <p className="line-clamp-1">{name}</p>
    </button>
  );
};
