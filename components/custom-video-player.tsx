"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";

import { cn } from "@/lib/utils";

// Import the quality selector plugin
import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";

// Extend the Player type to include the quality selector plugin
declare module "video.js" {
  interface Player {
    hlsQualitySelector: (options: { displayCurrentQuality: boolean }) => void;
  }
}

interface CustomVideoPlayerProps {
  src: string;
  className?: string;
  onEnded?: () => void;
  onReady?: () => void;
  title?: string;
}

const CustomVideoPlayer = ({
  src,
  className,
  onEnded,
  onReady,
  title,
}: CustomVideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Create video element
    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered");
    videoRef.current.appendChild(videoElement);

    // Initialize player
    const player = (playerRef.current = videojs(videoElement, {
      controls: true,
      fluid: true,
      responsive: true,
      html5: {
        hls: {
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          overrideNative: true,
        },
      },
      playbackRates: [0.5, 1, 1.25, 1.5, 1.75, 2],
      sources: [
        {
          src,
          type: "application/x-mpegURL",
        },
      ],
    }));

    // Add quality selector plugin
    // @ts-expect-error
    player.hlsQualitySelector({
      displayCurrentQuality: true,
    });

    // Wait for the control bar to be ready
    player.ready(() => {
      // Get the control bar component
      const controlBar = player.getChild("ControlBar");
      if (!controlBar) return;

      // Create rewind button with proper event handling
      const rewindButton = videojs.dom.createEl("button", {
        className: "vjs-control vjs-button vjs-rewind-30",
        innerHTML: `
          <span aria-hidden="true" class="vjs-icon-placeholder">⟲</span>
          <span class="vjs-control-text">Rewind 30 seconds</span>
        `,
      }) as HTMLButtonElement;

      // Use addEventListener instead of onclick
      rewindButton.addEventListener("click", () => {
        const currentTime = player.currentTime() ?? 0;
        player.currentTime(Math.max(0, currentTime - 30));
      });

      // Create forward button with proper event handling
      const forwardButton = videojs.dom.createEl("button", {
        className: "vjs-control vjs-button vjs-forward-30",
        innerHTML: `
          <span aria-hidden="true" class="vjs-icon-placeholder">⟳</span>
          <span class="vjs-control-text">Forward 30 seconds</span>
        `,
      }) as HTMLButtonElement;

      // Use addEventListener instead of onclick
      forwardButton.addEventListener("click", () => {
        const currentTime = player.currentTime() ?? 0;
        const duration = player.duration();
        player.currentTime(Math.max(0, (currentTime ?? 0) - 30));
      });

      // Insert buttons at specific positions
      const progressControl = controlBar.getChild("ProgressControl");
      if (progressControl) {
        controlBar.el().insertBefore(rewindButton, progressControl.el());
        controlBar
          .el()
          .insertBefore(forwardButton, progressControl.el().nextSibling);
      }

      // Handle playback rate menu positioning
      const playbackRateMenuButton = controlBar.getChild(
        "PlaybackRateMenuButton"
      );
      if (playbackRateMenuButton && "menu" in playbackRateMenuButton) {
        const menuEl = (playbackRateMenuButton as any).menu?.contentEl_;
        if (menuEl) {
          menuEl.style.bottom = "3em";
        }
      }
    });

    // Add event listeners
    player.on("ended", () => {
      onEnded?.();
    });

    player.on("ready", () => {
      onReady?.();
    });

    // Clean up
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, onEnded, onReady]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} className={cn("video-container", className)} />
    </div>
  );
};

export default CustomVideoPlayer;
