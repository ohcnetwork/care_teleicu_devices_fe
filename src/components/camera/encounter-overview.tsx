import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mutate, query } from "@/lib/request";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Autocomplete } from "@/components/ui/autocomplete";
import CameraFeedControls from "@/lib/camera/player/feed-controls";
import CameraFeedPlayer from "@/lib/camera/player/feed-player";
import { CameraFeedProvider } from "@/lib/camera/camera-feed-context";
import { Encounter } from "@/lib/types/encounter";
import { I18NNAMESPACE } from "@/lib/constants";
import { PositionPreset } from "@/lib/camera/types";
import cameraActionApi from "@/lib/camera/cameraActionApi";
import cameraPositionPresetApi from "@/lib/camera/cameraPositionPresetApi";
import camerasOfPresetLocationApi from "@/lib/camera/camerasOfPresetLocationApi";
import { useTranslation } from "react-i18next";

interface Props {
  encounter: Encounter;
}

export const CameraEncounterOverview = ({ encounter }: Props) => {
  const { t } = useTranslation(I18NNAMESPACE);

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

  const { mutate: absoluteMove, isPending: isMoving } = useMutation({
    mutationFn: mutate(cameraActionApi.absoluteMove, {
      pathParams: { cameraId: activeCamera ?? "" },
    }),
  });

  useEffect(() => {
    if (positionPresets?.results.length) {
      setSelectedPreset(positionPresets.results[0]);
    }
  }, [positionPresets]);

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
    <div className="flex flex-col gap-4">
      <Tabs value={activeCamera || undefined} onValueChange={setActiveCamera}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            {cameras.results.map((camera) => (
              <TabsTrigger key={camera.id} value={camera.id}>
                {camera.user_friendly_name || camera.registered_name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Position Preset Selector */}
          <div className="w-64 ml-4">
            <Autocomplete
              disabled={isMoving}
              options={positionPresets?.results || []}
              value={selectedPreset}
              onSelect={setSelectedPreset}
              placeholder={t("select_position_preset") + "..."}
              searchPlaceholder={t("search_presets") + "..."}
              noResultsText={t("no_position_presets")}
              renderOption={({ name }) => (
                <span className="font-medium">{name}</span>
              )}
              renderValue={(preset) =>
                preset?.name || t("select_position_preset") + "..."
              }
              isLoading={!positionPresets}
              className="w-full"
            />
          </div>
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
  );
};
