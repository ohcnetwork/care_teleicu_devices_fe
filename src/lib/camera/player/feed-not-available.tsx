import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { I18NNAMESPACE } from "@/lib/constants";
import { RedoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function FeedNotAvailable({
  message,
  streamUrl,
  onResetClick,
  className,
}: {
  message: string;
  className?: string;
  streamUrl?: string;
  onResetClick: () => void;
}) {
  const { t } = useTranslation(I18NNAMESPACE);

  if (process.env.NODE_ENV === "development") {
    streamUrl = streamUrl
      ?.replace(
        /[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}/gi,
        "**"
      )
      .replace(/\/\d+/g, "**");
  }

  return (
    <div
      className={cn(
        "absolute inset-x-0 inset-y-0 z-[5] flex flex-col items-center justify-center gap-2 text-center",
        className
      )}
    >
      <ExclamationTriangleIcon className="text-2xl" />
      <span className="text-xs font-bold">{message}</span>
      <span className="hidden px-10 font-mono text-xs text-secondary-500 md:block">
        {streamUrl}
      </span>
      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onResetClick}>
          <RedoIcon />
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}
