import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CameraDevice, PositionPreset } from "@/lib/camera/types";
import { query, mutate } from "@/lib/request";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Move, Save, ChevronDown } from "lucide-react";
import cameraPositionPresetApi from "@/lib/camera/cameraPositionPresetApi";
import useCameraStatus from "@/lib/camera/useCameraStatus";

interface Props {
  device: CameraDevice;
  locationId: string;
  selectedPreset: PositionPreset | undefined;
  onSelectPreset: (preset: PositionPreset) => void;
  isMoving: boolean;
}

export const PresetDropdown = ({
  device,
  locationId,
  selectedPreset,
  onSelectPreset,
  isMoving,
}: Props) => {
  const queryClient = useQueryClient();
  const { data: cameraStatus } = useCameraStatus(device);

  const { data: positionPresets } = useQuery({
    queryKey: ["camera-presets", device.id, locationId],
    queryFn: query(cameraPositionPresetApi.list, {
      pathParams: { cameraId: device.id },
      queryParams: { location: locationId, limit: 100 },
    }),
  });

  const { mutate: updatePreset } = useMutation({
    mutationFn: (preset: PositionPreset) =>
      mutate(cameraPositionPresetApi.update, {
        pathParams: { cameraId: device.id, presetId: preset.id },
      })({
        name: preset.name,
        ptz: cameraStatus?.position ?? preset.ptz,
        location: preset.location?.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["camera-presets", device.id, locationId],
      });
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="justify-between"
          disabled={!positionPresets?.results.length}
        >
          <span className="text-sm">Position Presets</span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-64 sm:w-auto p-0" align="end">
        <div className="max-h-80 overflow-y-auto">
          {positionPresets?.results.map((preset) => (
            <div
              key={preset.id}
              className="flex gap-3 items-center justify-between px-3 py-2 hover:bg-gray-50"
            >
              <span className="font-medium truncate text-sm">
                {preset.name}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  disabled={isMoving}
                  size="xs"
                  onClick={() => onSelectPreset(preset)}
                >
                  <span>Move</span>
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    if (cameraStatus) {
                      updatePreset(preset);
                    }
                  }}
                  disabled={!cameraStatus || isMoving}
                >
                  <span>Save</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
