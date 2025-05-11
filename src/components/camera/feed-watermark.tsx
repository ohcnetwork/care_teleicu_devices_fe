import { useAtomValue } from "jotai";
import { authUserAtom } from "@/state/user-atom";
import { cn } from "@/lib/utils";

export const CameraFeedWatermark = () => {
  const authUser = useAtomValue(authUserAtom);
  if (!authUser) return null;

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      <Watermark className="left-1/3 top-1/3 -translate-x-1/2 -translate-y-1/2">
        {authUser.username}
      </Watermark>
      <Watermark className="bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2">
        {authUser.username}
      </Watermark>
    </div>
  );
};

const Watermark = (props: { children: string; className: string }) => {
  return (
    <span
      className={cn(
        "absolute z-10 font-semibold text-white/20 md:text-2xl",
        props.className
      )}
      aria-hidden="true"
    >
      {props.children}
    </span>
  );
};

export default CameraFeedWatermark;
