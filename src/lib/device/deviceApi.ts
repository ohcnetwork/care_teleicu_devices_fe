import { DeviceListResponse } from "@/lib/device/types";
import { apiRoutes, HttpMethod } from "@/lib/request";

export default apiRoutes({
  listDevices: {
    path: "/api/v1/facility/{facilityId}/device/",
    method: HttpMethod.GET,
    TResponse: {} as DeviceListResponse,
  },
});
