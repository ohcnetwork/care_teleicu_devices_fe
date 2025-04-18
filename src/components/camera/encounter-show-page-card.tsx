import { TableSkeleton } from "@/components/common/skeleton-loading";
import { CameraFeedProvider } from "@/lib/camera/camera-feed-context";
import cameraPositionPresetApi from "@/lib/camera/cameraPositionPresetApi";
import CameraFeedControls from "@/lib/camera/player/feed-controls";
import CameraFeedPlayer from "@/lib/camera/player/feed-player";
import { CameraDevice, PositionPreset } from "@/lib/camera/types";
import { query, mutate } from "@/lib/request";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LocationSearch } from "@/components/common/location-search";
import { LocationList } from "@/lib/types/location";
import useCameraStatus from "@/lib/camera/useCameraStatus";
import { stringifyNestedObject } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Plus } from "lucide-react";
import PluginComponent from "@/components/common/plugin-component";

export const CameraShowPageCard = ({
  device,
  facilityId,
}: {
  device: CameraDevice;
  facilityId: string;
}) => {
  return (
    <PluginComponent>
      <CameraStream device={device} />
      <CameraPositionPresets device={device} facilityId={facilityId} />
    </PluginComponent>
  );
};

const CameraStream = ({ device }: { device: CameraDevice }) => {
  const { data: status, isError, refetch } = useCameraStatus(device, 500);
  return (
    <CameraFeedProvider device={device}>
      <div className="relative aspect-video bg-gray-950 group rounded-xl overflow-hidden shadow-lg">
        <CameraFeedPlayer />
        <CameraFeedControls inlineView />
      </div>
      {!!status && (
        <div className="mt-2 flex flex-wrap gap-2">
          <div className="text-xs bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1.5">
            <span className="font-medium text-gray-700">Position:</span>
            <span className="text-gray-600">
              X: {status.position.x.toFixed(1)}, Y:{" "}
              {status.position.y.toFixed(1)}, Z:{" "}
              {status.position.zoom.toFixed(1)}
            </span>
          </div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1.5">
            <span className="font-medium text-gray-700">Pan/Tilt:</span>
            <span
              className={`${
                status.moveStatus.panTilt === "MOVING"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {status.moveStatus.panTilt}
            </span>
          </div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1.5">
            <span className="font-medium text-gray-700">Zoom:</span>
            <span
              className={`${
                status.moveStatus.zoom === "MOVING"
                  ? "text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {status.moveStatus.zoom}
            </span>
          </div>
          {status.error && (
            <div className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-md flex items-center gap-1.5">
              <span className="font-medium">Error:</span>
              <span>{status.error}</span>
            </div>
          )}
        </div>
      )}
      {isError && (
        <div className="text-xs bg-amber-50 px-3 py-2 rounded-md flex items-center gap-2 border border-amber-200 shadow-sm mt-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="font-medium text-amber-700">Warning:</span>
          <span className="text-amber-700 flex-1">
            Unable to communicate with the camera device. The camera credentials
            may be incorrect.
          </span>
          <Button variant="warning" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}
    </CameraFeedProvider>
  );
};

const CameraPositionPresets = ({
  device,
  facilityId,
}: {
  device: CameraDevice;
  facilityId: string;
}) => {
  const queryClient = useQueryClient();
  const [presetName, setPresetName] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationList | null>(
    null
  );

  // Fetch presets - the API now returns location data directly
  const { data, isLoading } = useQuery({
    queryKey: ["camera-position-presets", device.id],
    queryFn: query(cameraPositionPresetApi.list, {
      pathParams: { cameraId: device.id },
      queryParams: { limit: 100 },
    }),
  });

  const { data: cameraStatus } = useCameraStatus(device);

  const { mutate: createPreset, isPending: isCreatingPreset } = useMutation({
    mutationFn: mutate(cameraPositionPresetApi.create, {
      pathParams: { cameraId: device.id },
    }),
    onSuccess: () => {
      // Refresh the presets list after creation
      queryClient.invalidateQueries({
        queryKey: ["camera-position-presets", device.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["camera-presets"],
      });

      setPresetName("");
      setSelectedLocation(null);
      setPopoverOpen(false);
    },
  });

  const handleCreatePreset = () => {
    if (!presetName.trim() || !cameraStatus) return;

    createPreset({
      name: presetName.trim(),
      ptz: cameraStatus.position,
      location: selectedLocation?.id,
    });
  };

  if (isLoading || !data) {
    return <TableSkeleton count={5} />;
  }

  // Group presets by location
  type GroupedPresets = {
    locationId: string;
    locationName: string;
    presets: PositionPreset[];
  };

  const groupedPresets: GroupedPresets[] = [];

  const presetsWithLocation = data.results.filter((preset) => preset.location);
  const locationMap = new Map<string, GroupedPresets>();

  presetsWithLocation.forEach((preset) => {
    const locationId = preset.location?.id;
    if (locationId && !locationMap.has(locationId)) {
      locationMap.set(locationId, {
        locationId,
        locationName: stringifyNestedObject(preset.location),
        presets: [],
      });
    }
    if (locationId) {
      locationMap.get(locationId)?.presets.push(preset);
    }
  });

  // Add location groups to the groupedPresets array
  locationMap.forEach((group) => {
    groupedPresets.push(group);
  });

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Position Presets</h3>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Create Preset
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">
                Save current position as a preset
              </h4>
              <div className="space-y-2">
                <Label htmlFor="preset-name">
                  Preset Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="preset-name"
                  placeholder="Enter preset name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <LocationSearch
                  facilityId={facilityId}
                  mode="instance"
                  onSelect={setSelectedLocation}
                  value={selectedLocation}
                  disabled={isCreatingPreset}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setPopoverOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleCreatePreset}
                  disabled={
                    !presetName.trim() ||
                    !selectedLocation ||
                    isCreatingPreset ||
                    !cameraStatus
                  }
                >
                  Save
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
