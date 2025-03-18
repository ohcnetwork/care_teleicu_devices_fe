import careApi from "@/lib/careApi";
import { query } from "@/lib/request";
import { LocationMode, Status } from "@/lib/types/location";
import { useQuery } from "@tanstack/react-query";

interface Props {
  facilityId: string;
  search?: string;
  available?: boolean;
  mode?: LocationMode;
  status?: Status;
  parentId?: string;
}

export const useFacilityLocation = ({
  facilityId,
  search,
  available = true,
  mode,
  status,
  parentId,
}: Props) => {
  return useQuery({
    queryKey: [
      "facility-locations",
      facilityId,
      { search, available, mode, status },
    ],
    queryFn: query(careApi.listLocations, {
      pathParams: { facilityId },
      queryParams: {
        name: search,
        available,
        mode,
        status,
        parent: parentId,
      },
    }),
  });
};
