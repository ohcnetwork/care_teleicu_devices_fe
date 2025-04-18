import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "raviger";

const CameraErrorFallback = ({
  onRetry,
  deviceId,
  hasConfigurePermission,
}: {
  onRetry: () => void;
  deviceId: string;
  hasConfigurePermission: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 text-amber-800 bg-amber-50 border border-amber-200">
      <AlertTriangle className="h-10 w-10 mb-2 text-amber-500" />
      <p className="font-semibold text-lg mb-2">Unable to load camera stream</p>
      <p className="text-sm mb-4">
        The camera may be offline or misconfigured.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
        {hasConfigurePermission && (
          <Link href={`/device/${deviceId}/configure`}>
            <Button variant="secondary" size="sm">Configure Device</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CameraErrorFallback;
