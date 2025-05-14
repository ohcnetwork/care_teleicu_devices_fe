import { PositionPreset, PositionPresetWriteRequest } from "@/lib/camera/types";
import { HttpMethod, PaginatedResponse, apiRoutes } from "@/lib/request";

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
  batchRequest: {
    path: "/api/v1/batch_requests/",
    method: HttpMethod.POST,
    TRequest: {} as {
      requests: Array<{
        url: string;
        method: HttpMethod;
        reference_id: string;
        body: PositionPresetWriteRequest;
      }>;
    },
    TResponse: {} as {
      results: Array<{
        reference_id: string;
        status: number;
        body: PositionPreset;
      }>;
    },
  },
  set_default: {
    path: "/api/camera_device/{cameraId}/position_presets/{presetId}/set_default/",
    method: HttpMethod.POST,
    TResponse: {} as unknown,
  },
});
