"use client";

import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";

import CustomVideoPlayer from "../../../../../../../components/custom-video-player";

interface VideoPlayerProps {
  playbackId: string;
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  playbackToken: string;
  videoUrl: string;
}

const VideoPlayer = ({
  playbackId,
  chapterId,
  courseId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  playbackToken,
  videoUrl,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
      }

      if (!nextChapterId) {
        confetti.onOpen();
      }

      toast.success("Progress updated");

      router.refresh();

      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="w-8 h-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && playbackToken && (
        // <MuxPlayer
        //   title={title}
        //   className={cn(!isReady && "hidden")}
        //   onCanPlay={() => setIsReady(true)}
        //   onEnded={onEnd}
        //   // autoPlay
        //   playbackId={playbackId}
        //   tokens={{
        //     playback: playbackToken,
        //   }}
        //   streamType="on-demand"
        //   preferPlayback="mse"
        //   thumbnailTime={0}
        // />
        <CustomVideoPlayer
          src={videoUrl}
          onReady={() => setIsReady(true)}
          onEnded={onEnd}
          className={cn(!isReady && "hidden")}
          title={title}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
