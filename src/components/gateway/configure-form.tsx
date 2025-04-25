import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ConfigureFormProps } from "@/lib/types/common";
import { NetworkMetrics } from "@/components/common/network-metrics";
import PluginComponent from "@/components/common/plugin-component";
import { useGatewayHealthCheck } from "@/lib/device/hooks/useGatewayHealthCheck";

type TestStatus = "idle" | "loading" | "success" | "partial" | "error";

export const GatewayDeviceConfigureForm = ({
  metadata,
  onChange,
}: ConfigureFormProps) => {
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const {
    healthData,
    isLoading,
    error,
    metrics: pingMetrics,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
  } = useGatewayHealthCheck(metadata.endpoint_address || "");

  // Auto-open popover when test completes
  useEffect(() => {
    if (testStatus !== "idle" && testStatus !== "loading") {
      setPopoverOpen(true);
    }
  }, [testStatus]);

  // Update test status based on health check results
  useEffect(() => {
    if (isLoading) {
      setTestStatus("loading");
    } else if (error) {
      setTestStatus("error");
      setStatusMessage(error.message);
    } else if (healthData) {
      if (healthData.server && healthData.database) {
        setTestStatus("success");
        setStatusMessage("Connection successful. All services are running.");
      } else {
        setTestStatus("partial");
        const issues = [];
        if (!healthData.server) issues.push("Server");
        if (!healthData.database) issues.push("Database");
        setStatusMessage(
          `Connection issues detected: ${issues.join(", ")} not available.`
        );
      }
    }
  }, [healthData, isLoading, error]);

  const testConnection = async () => {
    if (!metadata.endpoint_address) {
      setTestStatus("error");
      setStatusMessage("Please enter the endpoint address first");
      return;
    }

    setTestStatus("loading");
    setPopoverOpen(false);
    resetMetrics();
    startMonitoring();
  };

  const getServiceStatusMessage = () => {
    if (!healthData) return "Service status unknown";

    const operationalCount = [healthData.server, healthData.database].filter(
      Boolean
    ).length;
    const totalServices = 2;

    if (operationalCount === 0) return "All services are down";
    if (operationalCount === totalServices)
      return "All services are operational";
    return `${operationalCount} of ${totalServices} services are operational`;
  };

  const renderStatusDetails = () => {
    if (testStatus === "success") {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Connection Successful</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>{getServiceStatusMessage()}:</p>
            <ul className="mt-1 pl-2">
              <li className="text-green-600">
                Server: {healthData?.server ? "Online" : "Offline"}
              </li>
              <li className="text-green-600">
                Database: {healthData?.database ? "Online" : "Offline"}
              </li>
            </ul>
          </div>
          {testStatus === "success" && <NetworkMetrics metrics={pingMetrics} />}
        </div>
      );
    }

    if (testStatus === "partial") {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Partial Connection</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>{getServiceStatusMessage()}:</p>
            <ul className="mt-1 list-disc pl-5">
              <li
                className={
                  healthData?.server ? "text-green-600" : "text-red-600"
                }
              >
                Server: {healthData?.server ? "Online" : "Offline"}
              </li>
              <li
                className={
                  healthData?.database ? "text-green-600" : "text-red-600"
                }
              >
                Database: {healthData?.database ? "Online" : "Offline"}
              </li>
            </ul>
          </div>
        </div>
      );
    }

    if (testStatus === "error") {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="font-medium">Connection Failed</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Error details:</p>
            <p className="mt-1 text-red-600">{statusMessage}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderStatusIcon = () => {
    if (testStatus === "idle") return null;

    if (testStatus === "loading") {
      return <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />;
    }

    const iconMap = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      partial: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      error: <XCircle className="h-5 w-5 text-red-500" />,
    };

    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="focus:outline-none relative"
            aria-label="View connection status details"
          >
            {iconMap[testStatus]}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {renderStatusDetails()}
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <PluginComponent>
      <div className="space-y-4">
        <div>
          <Label className="mb-2">
            Gateway's Endpoint Address
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              autoComplete=""
              placeholder="Gateway's Endpoint Address without http:// or https://"
              value={metadata.endpoint_address}
              onChange={(e) => {
                onChange({
                  ...metadata,
                  endpoint_address: e.target.value,
                });
                stopMonitoring();
              }}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              {renderStatusIcon()}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={testConnection}
                disabled={isLoading || !metadata.endpoint_address}
              >
                Test Connection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PluginComponent>
  );
};
