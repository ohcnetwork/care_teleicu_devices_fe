import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDevices from "@/lib/device/hooks/useDevices";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfigureFormProps } from "@/lib/types/common";

export const VitalsObservationConfigureForm = ({
  facilityId,
  metadata,
  onChange,
}: ConfigureFormProps) => {
  const { data, isLoading } = useDevices({
    facilityId,
    careType: "gateway",
  });

  const gatewayId =
    (typeof metadata.gateway === "object" && metadata.gateway?.id) ||
    metadata.gateway;

  const gatewayDevices = data?.results ?? [];
  const gateway = gatewayDevices.find((device) => device.id === gatewayId);

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2">Type</Label>
        <Select
          value={metadata.type || ""}
          onValueChange={(value) => onChange({ ...metadata, type: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select device type..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HL7-Monitor">HL7 Monitor</SelectItem>
            {/* <SelectItem value="Ventilator">Ventilator</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">Gateway Device</Label>
        <Select
          value={gatewayId}
          onValueChange={(value) =>
            onChange({ ...metadata, gateway: value === "none" ? null : value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select gateway device...">
              {gateway?.registered_name || gateway?.user_friendly_name}{" "}
              <span className="text-gray-500">
                (Endpoint Address:{" "}
                {(gateway?.care_metadata.endpoint_address as string) || "--"})
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                Loading...
              </div>
            ) : gatewayDevices.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                No gateway devices found
              </div>
            ) : (
              <>
                <SelectItem value="none">None</SelectItem>
                {gatewayDevices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    <p className="text-sm">
                      {device.registered_name || device.user_friendly_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Endpoint Address:{" "}
                      <span className="font-medium">
                        {(device.care_metadata.endpoint_address as string) ||
                          "--"}
                      </span>
                    </p>
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">Endpoint Address</Label>
        <Input
          type="text"
          placeholder="Vitals Observation Device's endpoint address (e.g., 192.168.1.100)"
          value={metadata.endpoint_address || ""}
          onChange={(e) => {
            onChange({
              ...metadata,
              endpoint_address: e.target.value,
            });
          }}
        />
      </div>
    </div>
  );
};
