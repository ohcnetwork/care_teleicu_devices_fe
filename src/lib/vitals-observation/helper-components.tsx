import { VitalsValueBase } from "@/lib/vitals-observation/types";

const NonWaveformContentGroup = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => (
  <div className="z-[5] grid grid-cols-2 gap-x-8 gap-y-4 divide-blue-600 border-b border-blue-600 bg-[#020617] tracking-wider text-white md:absolute md:inset-y-0 md:right-0 md:grid-cols-1 md:gap-0 md:divide-y md:border-b-0 md:border-l">
    {children}
  </div>
);
NonWaveformContentGroup.displayName = "NonWaveformContentGroup";

const NonWaveformData = ({
  label,
  attr,
  className,
  suffix,
}: {
  label: string;
  attr?: VitalsValueBase;
  className?: string;
  suffix?: JSX.Element;
}) => {
  return (
    <div className={`flex items-center justify-between p-1 ${className}`}>
      <div className="flex h-full flex-col items-start gap-1 font-bold">
        <span className="text-sm">{label}</span>
        <span className="text-xs">{attr?.unit ?? "--"}</span>
      </div>
      <span className="ml-4 mr-3 text-4xl font-black md:text-6xl">
        {attr?.value ?? "--"}
      </span>
      {attr?.value && suffix}
    </div>
  );
};
NonWaveformData.displayName = "NonWaveformData";

const WaveformLabels = ({ labels }: { labels: Record<string, string> }) => {
  return (
    <div className="absolute flex h-full flex-col items-start justify-between font-mono text-sm font-medium">
      {Object.entries(labels).map(([label, className], i) => (
        <span key={i} className={`flex flex-1 flex-col pt-1 ${className}`}>
          {label}
        </span>
      ))}
    </div>
  );
};
WaveformLabels.displayName = "WaveformLabels";
export { NonWaveformContentGroup, NonWaveformData, WaveformLabels };
