import { MutableRefObject } from "react";

import { CameraDevice } from "@/lib/camera/types";

export const calculateVideoDelay = (
  ref: MutableRefObject<HTMLVideoElement | null>,
  playedOn?: Date,
) => {
  const video = ref.current;

  if (!video || !playedOn) {
    return 0;
  }

  const playedDuration = (new Date().getTime() - playedOn.getTime()) / 1e3;
  return playedDuration - video.currentTime;
};
