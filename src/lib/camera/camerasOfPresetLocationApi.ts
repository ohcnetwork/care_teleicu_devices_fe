import { CameraDevice } from "@/lib/camera/types";
import { HttpMethod, PaginatedResponse, apiRoutes } from "@/lib/request";

export default apiRoutes({
  list: {
    path: "/api/camera_device/preset_location_cameras/{locationId}/",
    method: HttpMethod.GET,
    TResponse: {} as PaginatedResponse<CameraDevice>,
  },
});
