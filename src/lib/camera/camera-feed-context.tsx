import cameraActionApi, {
  GetStatusResponse,
} from "@/lib/camera/cameraActionApi";
import { useStreamUrl } from "@/lib/camera/player/useStreamUrl";
import { CameraDevice, PTZPayload } from "@/lib/camera/types";
import useCameraStatus from "@/lib/camera/useCameraStatus";
import { mutate, query } from "@/lib/request";
import {
  UseMutateFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { createContext, useContext, useRef, useState } from "react";

type PlayerStatus = "loading" | "playing" | "stopped";

type ICameraFeedContext = {
  device: CameraDevice;

  playerRef: React.RefObject<HTMLVideoElement>;
  playedOn: Date | undefined;
  setPlayedOn: (playedOn: Date) => void;

  playerStatus: PlayerStatus;
  setPlayerStatus: (playerStatus: PlayerStatus) => void;

  streamUrl: string | undefined;
  isAuthenticating: boolean;

  cameraStatus: GetStatusResponse | undefined;
  cameraStatusLoading: boolean;

  relativeMove: UseMutateFunction<unknown, Error, PTZPayload, unknown>;
};

const CameraFeedContext = createContext<ICameraFeedContext | null>(null);

export function CameraFeedProvider({
  children,
  device,
}: {
  children: React.ReactNode;
  device: CameraDevice;
}) {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>("loading");
  const [playedOn, setPlayedOn] = useState<Date>();

  const { data: streamUrl, isPending: isAuthenticating } = useStreamUrl(device);

  const { data: cameraStatus, isFetching: cameraStatusLoading } =
    useCameraStatus(device);

  const { mutate: relativeMove } = useMutation({
    mutationFn: mutate(cameraActionApi.relativeMove, {
      pathParams: { cameraId: device.id },
    }),
  });

  return (
    <CameraFeedContext.Provider
      value={{
        device,
        playerRef,
        playedOn,
        setPlayedOn,
        playerStatus,
        setPlayerStatus,
        streamUrl,
        isAuthenticating,
        cameraStatus,
        cameraStatusLoading,
        relativeMove,
      }}
    >
      {children}
    </CameraFeedContext.Provider>
  );
}

export function useCameraFeed() {
  const context = useContext(CameraFeedContext);
  if (!context) {
    throw new Error("useCameraFeed must be used within a CameraFeedProvider");
  }
  return context;
}
