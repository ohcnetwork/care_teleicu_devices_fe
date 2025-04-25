import { useCameraFeed } from "@/lib/camera/camera-feed-context";
import { VideoStreamPlayer } from "@/lib/camera/components/video-stream-player";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import React, { useEffect } from "react";

export default function CameraFeedPlayer() {
  const {
    playerRef,
    streamUrl,
    isAuthenticating,
    playerStatus,
    setPlayerStatus,
    setPlayedOn,
  } = useCameraFeed();

  if (!streamUrl || isAuthenticating) {
    return <StreamLoading />;
  }

  useEffect(() => {
    if (playerStatus === "waiting") {
      const timeout = setTimeout(() => {
        setPlayerStatus("unauthorized");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [playerStatus]);

  return (
    <>
      {(playerStatus === "loading" || playerStatus === "waiting") && (
        <StreamLoading />
      )}
      {playerStatus === "unauthorized" && <StreamUnauthorized />}
      <VideoStreamPlayer
        playerRef={playerRef as React.RefObject<HTMLVideoElement>}
        streamUrl={streamUrl}
        className="w-full object-contain"
        onConnected={() => {
          setPlayerStatus("waiting");
          setPlayedOn(new Date());
        }}
        onPlay={() => {
          setPlayerStatus("playing");
        }}
        onError={() => setPlayerStatus("stopped")}
      />
    </>
  );
}

const StreamLoading = () => {
  return (
    <div className="absolute inset-0 size-full bg-gray-950 flex items-center justify-center">
      <Loader2 className="size-6 animate-spin text-white" />
    </div>
  );
};

const StreamUnauthorized = () => {
  return (
    <div className="absolute inset-0 size-full bg-gray-950 flex flex-col gap-2 items-center justify-center">
      <AlertTriangleIcon className="size-6 text-orange-400" />
      <div className="text-orange-400 text-sm">
        Stream authentication failed
      </div>
    </div>
  );
};
