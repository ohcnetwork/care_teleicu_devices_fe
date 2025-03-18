import { Skeleton } from "@/components/ui/skeleton";
import { CameraFeedProvider } from "@/lib/camera/camera-feed-context";
import CameraFeedControls from "@/lib/camera/player/feed-controls";
import CameraFeedPlayer from "@/lib/camera/player/feed-player";
import { CameraDevice } from "@/lib/camera/types";
import deviceApi from "@/lib/device/deviceApi";
import { DeviceListResponse } from "@/lib/device/types";
import { query } from "@/lib/request";
import { Encounter } from "@/lib/types/encounter";
import { useQuery } from "@tanstack/react-query";

interface Props {
  encounter: Encounter;
}

export const CameraEncounterOverview = ({ encounter }: Props) => {
  const { data: devices, isLoading } = useQuery({
    queryKey: ["camera-devices", encounter.id],
    queryFn: query(deviceApi.listDevices, {
      queryParams: {
        care_type: "camera",
        current_encounter: encounter.id,
      },
    }),
    select: (data: DeviceListResponse) => data.results,
  });

  if (isLoading || !devices) {
    return <Skeleton className="h-24 md:h-48 w-full" />;
  }

  if (devices.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {devices.map((device) => (
        <EncounterCamera
          key={device.id}
          device={device as unknown as CameraDevice}
        />
      ))}
    </div>
  );
};

const EncounterCamera = ({ device }: { device: CameraDevice }) => {
  return (
    <CameraFeedProvider device={device}>
      <div className="relative aspect-video bg-gray-950 group rounded-xl overflow-hidden shadow-lg">
        <CameraFeedPlayer />
        <CameraFeedControls inlineView />
      </div>
    </CameraFeedProvider>
  );
};
