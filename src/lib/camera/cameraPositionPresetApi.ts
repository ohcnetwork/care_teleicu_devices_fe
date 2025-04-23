import { PositionPreset, PositionPresetWriteRequest } from "@/lib/camera/types";
import { apiRoutes, HttpMethod, PaginatedResponse } from "@/lib/request";

export default apiRoutes({
  list: {
    path: "/api/camera_device/{cameraId}/position_presets/",
    method: HttpMethod.GET,
    TResponse: {} as PaginatedResponse<PositionPreset>,
  },
  retrieve: {
    path: "/api/camera_device/{cameraId}/position_presets/{presetId}/",
    method: HttpMethod.GET,
    TResponse: {} as PositionPreset,
  },
  create: {
    path: "/api/camera_device/{cameraId}/position_presets/",
    method: HttpMethod.POST,
    TRequest: {} as PositionPresetWriteRequest,
    TResponse: {} as PositionPreset,
  },
  update: {
    path: "/api/camera_device/{cameraId}/position_presets/{presetId}/",
    method: HttpMethod.PUT,
    TRequest: {} as PositionPresetWriteRequest,
    TResponse: {} as PositionPreset,
  },
  delete: {
    path: "/api/camera_device/{cameraId}/position_presets/{presetId}/",
    method: HttpMethod.DELETE,
    TResponse: {} as unknown,
  },
  set_default: {
    path: "/api/camera_device/{cameraId}/position_presets/{presetId}/set_default/",
    method: HttpMethod.POST,
    TResponse: {} as unknown,
  },
});
