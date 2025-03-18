import cameraActionApi from "@/lib/camera/cameraActionApi";
import { CameraDevice } from "@/lib/camera/types";
import { query } from "@/lib/request";
import { useQuery } from "@tanstack/react-query";

export default function useCameraStatus(
  device: CameraDevice,
  refetchInterval: number | false = 1000
) {
  return useQuery({
    queryKey: ["camera-status", device.id],
    queryFn: query(cameraActionApi.getStatus, {
      pathParams: { cameraId: device.id },
    }),
    refetchInterval: refetchInterval,
  });
}
