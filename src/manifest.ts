import { ActivityIcon, CctvIcon, ServerIcon } from "lucide-react";
import routes from "./routes";
import { GatewayDeviceConfigureForm } from "@/components/gateway/configure-form";
import { CameraDeviceConfigureForm } from "@/components/camera/configure-form";
import { VitalsObservationConfigureForm } from "@/components/vitals-observation/configure-form";
import { GatewayShowPageCard } from "@/components/gateway/show-page-card";
import { CameraShowPageCard } from "@/components/camera/show-page-card";
import { VitalsObservationShowPageCard } from "@/components/vitals-observation/show-page-card";
import { CameraEncounterOverview } from "@/components/camera/encounter-overview";
import { VitalsObservationEncounterOverview } from "@/components/vitals-observation/encounter-overview";

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
