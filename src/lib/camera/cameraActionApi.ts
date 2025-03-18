import { PTZPayload } from "@/lib/camera/types";
import { apiRoutes, HttpMethod } from "@/lib/request";

export interface GetStatusResponse {
  position: PTZPayload;
  moveStatus: {
    panTilt: "IDLE" | "MOVING";
    zoom: "IDLE" | "MOVING";
  };
  error: string;
}

export default apiRoutes({
  getStatus: {
    path: "/api/camera_device/actions/{cameraId}/get_status/",
    method: HttpMethod.GET,
    TResponse: {} as GetStatusResponse,
  },
  getPresets: {
    path: "/api/camera_device/actions/{cameraId}/get_presets/",
    method: HttpMethod.GET,
    TResponse: {} as Record<string, number>,
  },
  gotoPreset: {
    path: "/api/camera_device/actions/{cameraId}/goto_preset/",
    method: HttpMethod.POST,
    TRequest: {} as { preset: number },
    TResponse: {} as unknown,
  },
  absoluteMove: {
    path: "/api/camera_device/actions/{cameraId}/absolute_move/",
    method: HttpMethod.POST,
    TRequest: {} as PTZPayload,
    TResponse: {} as unknown,
  },
  relativeMove: {
    path: "/api/camera_device/actions/{cameraId}/relative_move/",
    method: HttpMethod.POST,
    TRequest: {} as PTZPayload,
    TResponse: {} as unknown,
  },
  getStreamToken: {
    path: "/api/camera_device/actions/{cameraId}/stream_token/",
    method: HttpMethod.GET,
    TResponse: {} as { token: string },
  },
});
