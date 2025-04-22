import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CameraFeedProvider } from "@/lib/camera/camera-feed-context";
import cameraActionApi from "@/lib/camera/cameraActionApi";
import cameraPositionPresetApi from "@/lib/camera/cameraPositionPresetApi";
import camerasOfPresetLocationApi from "@/lib/camera/camerasOfPresetLocationApi";
import CameraFeedControls from "@/lib/camera/player/feed-controls";
import CameraFeedPlayer from "@/lib/camera/player/feed-player";
import { PositionPreset } from "@/lib/camera/types";
import { query, mutate } from "@/lib/request";
import { Encounter } from "@/lib/types/encounter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import PluginComponent from "@/components/common/plugin-component";
import { PresetDropdown } from "./preset-dropdown";

interface Props {
  encounter: Encounter;
}

export const CameraEncounterOverview = ({ encounter }: Props) => {
  const [activeCamera, setActiveCamera] = useState<string>();
  const [selectedPreset, setSelectedPreset] = useState<PositionPreset>();

  const { data: cameras, isLoading } = useQuery({
    queryKey: ["camera-devices", encounter.current_location?.id],
    queryFn: query(camerasOfPresetLocationApi.list, {
      pathParams: {
        locationId: encounter.current_location?.id ?? "",
      },
    }),
    enabled: !!encounter.current_location,
  });

  const { data: positionPresets } = useQuery({
    queryKey: ["camera-presets", activeCamera, encounter.current_location?.id],
    queryFn: query(cameraPositionPresetApi.list, {
      pathParams: { cameraId: activeCamera ?? "" },
      queryParams: { location: encounter.current_location?.id, limit: 100 },
    }),
    enabled: !!activeCamera && !!encounter.current_location?.id,
  });

  const activeCameraDevice = cameras?.results.find(
    (c) => c.id === activeCamera
  );

  const { mutate: absoluteMove, isPending: isMoving } = useMutation({
    mutationFn: mutate(cameraActionApi.absoluteMove, {
      pathParams: { cameraId: activeCamera ?? "" },
    }),
  });

  useEffect(() => {
    if (positionPresets?.results.length) {
      setSelectedPreset(positionPresets.results[0]);
    }
  }, [positionPresets?.results.length]);

  useEffect(() => {
    if (selectedPreset) {
      absoluteMove(selectedPreset.ptz);
    }
  }, [selectedPreset]);

  // Set the first camera as active when cameras data is loaded
  if (cameras?.results.length && !activeCamera) {
    setActiveCamera(cameras.results[0].id);
  }

  if (isLoading || !cameras) {
    return null;
  }

  if (cameras.results.length === 0) {
    return null;
  }

  return (
    <PluginComponent>
      <div className="flex flex-col gap-4">
        <Tabs value={activeCamera || undefined} onValueChange={setActiveCamera}>
          <div className="flex items-center justify-between">
            <TabsList>
              {cameras.results.map((camera) => (
                <TabsTrigger key={camera.id} value={camera.id}>
                  {camera.user_friendly_name || camera.registered_name}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Position Preset Dropdown */}
            {activeCameraDevice && encounter.current_location && (
              <div className="ml-4">
                <PresetDropdown
                  device={activeCameraDevice}
                  locationId={encounter.current_location.id}
                  selectedPreset={selectedPreset}
                  onSelectPreset={setSelectedPreset}
                  isMoving={isMoving}
                />
              </div>
            )}
          </div>

          {/* Camera Feed Content */}
          {cameras.results.map((camera) => (
            <TabsContent key={camera.id} value={camera.id}>
              <CameraFeedProvider device={camera}>
                <div className="relative aspect-video bg-gray-950 group rounded-xl overflow-hidden shadow-lg">
                  <CameraFeedPlayer />
                  <CameraFeedControls
                    inlineView
                    onRelativeMoved={() => setSelectedPreset(undefined)}
                  />
                </div>
              </CameraFeedProvider>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PluginComponent>
  );
};
