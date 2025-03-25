import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfigureFormProps } from "@/lib/types/common";
import { I18NNAMESPACE } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useDevices from "@/lib/device/hooks/useDevices";
import { useTranslation } from "react-i18next";

export const CameraDeviceConfigureForm = ({
  facilityId,
  metadata,
  onChange,
}: ConfigureFormProps) => {
  const { t } = useTranslation(I18NNAMESPACE);

  const { data, isLoading } = useDevices({
    facilityId,
    careType: "gateway",
  });

  const [showPassword, setShowPassword] = useState(false);

  const gatewayId =
    (typeof metadata.gateway === "object" && metadata.gateway?.id) ||
    metadata.gateway;

  const handleChange = (key: string, value: any) => {
    onChange({ ...metadata, gateway: gatewayId, [key]: value });
  };

  useEffect(() => {
    if (gatewayId) {
      handleChange("gateway", gatewayId);
    }
  }, [gatewayId]);

  const gatewayDevices = data?.results ?? [];
  const gateway = gatewayDevices.find((device) => device.id === gatewayId);

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2">
          {t("device_type")}
          <span className="text-red-500">*</span>
        </Label>
        <Select
          value={metadata.type || ""}
          onValueChange={(value) => handleChange("type", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("device_type_placeholder") + "..."} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ONVIF">{t("device_type__ONVIF")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">
          {t("gateway_device")}
          <span className="text-red-500">*</span>
        </Label>
        <Select
          value={gatewayId}
          onValueChange={(value) => handleChange("gateway", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("gateway_device_placeholder") + "..."}>
              {gateway?.registered_name || gateway?.user_friendly_name}{" "}
              <span className="text-gray-500">
                ({t("endpoint_address")}:{" "}
                {(gateway?.care_metadata.endpoint_address as string) || "--"})
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                {t("loading")}...
              </div>
            ) : gatewayDevices.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                {t("no_gateway_devices")}
              </div>
            ) : (
              gatewayDevices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  <p className="text-sm">
                    {device.registered_name || device.user_friendly_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("endpoint_address")}:{" "}
                    <span className="font-medium">
                      {(device.care_metadata.endpoint_address as string) ||
                        "--"}
                    </span>
                  </p>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">
          {t("endpoint_address")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          placeholder={t("endpoint_address_placeholder")}
          value={metadata.endpoint_address || ""}
          onChange={(e) => handleChange("endpoint_address", e.target.value)}
        />
      </div>

      <div>
        <Label className="mb-2">
          {t("username")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder={t("username_placeholder")}
          autoComplete="off"
          value={metadata.username || ""}
          onChange={(e) => handleChange("username", e.target.value)}
        />
      </div>

      <div>
        <Label className="mb-2">
          {t("password")}
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            placeholder={t("password_placeholder")}
            value={metadata.password || ""}
            onChange={(e) => handleChange("password", e.target.value)}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? t("hide_password") : t("show_password")}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div>
        <Label className="mb-2">
          {t("stream_id")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          placeholder={t("stream_id_placeholder")}
          autoComplete="off"
          value={metadata.stream_id || ""}
          onChange={(e) => handleChange("stream_id", e.target.value)}
        />
      </div>
    </div>
  );
};
