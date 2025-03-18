/**
 * Referred from: https://stackoverflow.com/a/9039885/7887936
 * @returns `true` if device is iOS, else `false`
 */
function _isAppleDevice() {
  if (navigator.platform.includes("Mac")) return true;
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

/**
 * `true` if device is an Apple device, else `false`
 */
export const isAppleDevice = _isAppleDevice();

/**
 * `true` if device is an iOS device, else `false`
 */
export const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// export const calculateVideoDelay = (
//   ref: MutableRefObject<HTMLVideoElement | null>,
//   playedOn?: Date
// ) => {
//   const video = ref.current;

//   if (!video || !playedOn) {
//     return 0;
//   }

//   const playedDuration = (new Date().getTime() - playedOn.getTime()) / 1e3;
//   return playedDuration - video.currentTime;
// };

// export const getStreamUrl = (asset: AssetData, token?: string) => {
//   if (asset.asset_class !== AssetClass.ONVIF) {
//     throw "getStreamUrl can be invoked only for ONVIF Assets";
//   }

//   const config = getCameraConfig(asset.meta);
//   const host = asset.resolved_middleware?.hostname;
//   const uuid = config.accessKey;

//   return `wss://${host}/stream/${uuid}/channel/0/mse?uuid=${uuid}&channel=0${
//     token ? `&token=${token}` : ""
//   }`;
// };

// export const getCameraConfig = (meta: AssetData["meta"]) => {
//   return {
//     middleware_hostname: meta?.middleware_hostname,
//     hostname: meta?.local_ip_address,
//     username: meta?.camera_access_key?.split(":")[0],
//     password: meta?.camera_access_key?.split(":")[1],
//     accessKey: meta?.camera_access_key?.split(":")[2],
//     port: 80,
//   };
// };

// export const makeAccessKey = (
//   attrs: Pick<
//     ReturnType<typeof getCameraConfig>,
//     "username" | "password" | "accessKey"
//   >
// ) => {
//   return [attrs.username, attrs.password, attrs.accessKey]
//     .map((a) => a ?? "")
//     .join(":");
// };
