interface WatermarkProps {
  username?: string;
}

export const CameraFeedWatermark = ({ username }: WatermarkProps) => {
  const displayName = username || "defaultuser";

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <Watermark className="left-1/3 top-1/3 -translate-x-1/2 -translate-y-1/2">
        {displayName}
      </Watermark>

      <Watermark className="bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2">
        {displayName}
      </Watermark>
    </div>
  );
};

const Watermark = (props: { children: string; className: string }) => {
  return (
    <span
      className={`absolute z-10 font-semibold text-white/20 md:text-2xl  ${props.className}`}
      aria-hidden="true"
    >
      {props.children}
    </span>
  );
};

export default CameraFeedWatermark;
