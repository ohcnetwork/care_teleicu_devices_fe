import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CameraFeedProvider } from "@/lib/camera/camera-feed-context";
import camerasOfPresetLocationApi from "@/lib/camera/camerasOfPresetLocationApi";
import CameraFeedControls from "@/lib/camera/player/feed-controls";
import CameraFeedPlayer from "@/lib/camera/player/feed-player";
import { query } from "@/lib/request";
import { Encounter } from "@/lib/types/encounter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  encounter: Encounter;
}

export const CameraEncounterOverview = ({ encounter }: Props) => {
  const { data: cameras, isLoading } = useQuery({
    queryKey: ["camera-devices", encounter.current_location?.id],
    queryFn: query(camerasOfPresetLocationApi.list, {
      pathParams: {
        locationId: encounter.current_location?.id ?? "",
      },
    }),
    enabled: !!encounter.current_location,
  });

  // State to track the currently selected camera tab
  const [activeCamera, setActiveCamera] = useState<string | null>(null);

  // Set the first camera as active when cameras data is loaded
  if (cameras?.results.length && !activeCamera) {
    setActiveCamera(cameras.results[0].id);
  }

  if (isLoading || !cameras) {
    return <Skeleton className="h-24 md:h-48 w-full" />;
  }

  if (cameras.results.length === 0) {
    return null;
  }

  // If there's only one camera, directly show it without tabs
  if (cameras.results.length === 1) {
    const camera = cameras.results[0];
    return (
      <div className="flex flex-col gap-4">
        <CameraFeedProvider key={camera.id} device={camera}>
          <div className="relative aspect-video bg-gray-950 group rounded-xl overflow-hidden shadow-lg">
            <CameraFeedPlayer />
            <CameraFeedControls inlineView />
          </div>
        </CameraFeedProvider>
      </div>
    );
  }

  // If there are multiple cameras, show them in tabs
  return (
    <div className="flex flex-col gap-4">
      <Tabs value={activeCamera || undefined} onValueChange={setActiveCamera}>
        <TabsList>
          {cameras.results.map((camera) => (
            <TabsTrigger key={camera.id} value={camera.id}>
              {camera.user_friendly_name || camera.registered_name}
            </TabsTrigger>
          ))}
        </TabsList>

        {cameras.results.map((camera) => (
          <TabsContent key={camera.id} value={camera.id} className="mt-4">
            <CameraFeedProvider device={camera}>
              <div className="relative aspect-video bg-gray-950 group rounded-xl overflow-hidden shadow-lg">
                <CameraFeedPlayer />
                <CameraFeedControls inlineView />
              </div>
            </CameraFeedProvider>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
