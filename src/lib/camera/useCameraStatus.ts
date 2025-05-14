import { useQuery } from "@tanstack/react-query";

import cameraActionApi, {
  GetStatusResponse,
} from "@/lib/camera/cameraActionApi";
import { CameraDevice } from "@/lib/camera/types";
import { query } from "@/lib/request";

export default function useCameraStatus(
  device: CameraDevice,
  refetchInterval: number | false = 1000,
) {
  return useQuery<GetStatusResponse>({
    queryKey: ["camera-status", device.id],
    queryFn: query(cameraActionApi.getStatus, {
      pathParams: { cameraId: device.id },
      silent: true,
    }),
    refetchInterval: (query) => {
      // Only refetch if there's no error and refetchInterval is not false
      return query.state.error ? false : refetchInterval;
    },
    retry: false,
  });
}
