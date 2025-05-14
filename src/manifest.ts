import { ActivityIcon, CctvIcon, ServerIcon } from "lucide-react";

import { CameraDeviceConfigureForm } from "@/components/camera/configure-form";
import { CameraEncounterOverview } from "@/components/camera/encounter-overview";
import { CameraShowPageCard } from "@/components/camera/show-page-card";
import { GatewayDeviceConfigureForm } from "@/components/gateway/configure-form";
import { GatewayShowPageCard } from "@/components/gateway/show-page-card";
import { VitalsObservationConfigureForm } from "@/components/vitals-observation/configure-form";
import { VitalsObservationEncounterOverview } from "@/components/vitals-observation/encounter-overview";
import { VitalsObservationShowPageCard } from "@/components/vitals-observation/show-page-card";

import routes from "./routes";

const manifest = {
  plugin: "care-gateway-device",
  routes,
  extends: [],
  components: {},
  devices: [
    {
      type: "gateway",
      icon: ServerIcon,
      configureForm: GatewayDeviceConfigureForm,
      showPageCard: GatewayShowPageCard,
    },
    {
      type: "camera",
      configureForm: CameraDeviceConfigureForm,
      icon: CctvIcon,
      showPageCard: CameraShowPageCard,
      encounterOverview: CameraEncounterOverview,
    },
    {
      type: "vitals-observation",
      icon: ActivityIcon,
      configureForm: VitalsObservationConfigureForm,
      showPageCard: VitalsObservationShowPageCard,
      encounterOverview: VitalsObservationEncounterOverview,
    },
  ],
} as const;

export default manifest;
