import React, { useRef } from "react";

declare const ManagedMediaSource: typeof MediaSource;

type StreamPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  playerRef: React.RefObject<HTMLVideoElement>;
  streamUrl: string;
  className?: string;
  onPlay?: () => void;
  onEnded?: () => void;
  onWaiting?: () => void;
  onConnected?: () => void;
  onError?: (err: any) => void;
};

export const VideoStreamPlayer = ({
  playerRef,
  streamUrl,
  className,
  onPlay,
  onEnded,
  onWaiting,
  onConnected,
  onError,
  ...props
}: StreamPlayerProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  let mediaSource: MediaSource;
  let mseSourceBuffer: SourceBuffer;
  let buf: Uint8Array;
  let bufLen = 0;

  const pushPacket = () => {
    if (mseSourceBuffer.updating) return;

    try {
      if (bufLen > 0) {
        // If there's data in the buffer to append
        const data = buf.slice(0, bufLen);
        bufLen = 0; // Reset buffer length
        mseSourceBuffer.appendBuffer(data); // Append data to SourceBuffer
      } else if (mseSourceBuffer.buffered && mseSourceBuffer.buffered.length) {
        // If no new data to append, check if there's buffered data in SourceBuffer
        const end =
          mseSourceBuffer.buffered.end(mseSourceBuffer.buffered.length - 1) -
          15;
        const start = mseSourceBuffer.buffered.start(0);
        if (end > start) {
          // Remove older data from the SourceBuffer to free up space
          mseSourceBuffer.remove(start, end);
          mediaSource.setLiveSeekableRange(end, end + 15);
        }
      }
    } catch (e) {
      console.debug(e);
      onError?.(e);
    }
  };

  const readPacket = (event: MessageEvent<any>) => {
    if (mseSourceBuffer.updating || bufLen > 0) {
      // Buffer data if SourceBuffer is updating or buffer has data
      const b = new Uint8Array(event.data);
      buf.set(b, bufLen);
      bufLen += b.byteLength;
    } else {
      try {
        // Append data directly if SourceBuffer is ready
        mseSourceBuffer.appendBuffer(event.data);
      } catch (e) {
        console.debug(e);
        onError?.(e);
      }
    }
  };

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (mseSourceBuffer) {
      mseSourceBuffer.abort();
    }
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.src = "";
      playerRef.current.srcObject = null;
    }
  };

  const startHLS = () => {
    console.debug("Broken os/browser, falling back to hls");
    try {
      if (!playerRef.current || !streamUrl) return;
      const url = new URL(streamUrl);
      if (url.protocol === "wss:") {
        url.protocol = "https:";
      }
      url.pathname = url.pathname.replace("mse", "hls/live/index.m3u8");
      playerRef.current.src = url.toString();
      playerRef.current.onplaying = () => onConnected?.();
    } catch (err) {
      console.debug(err);
      onError?.(err);
    }
  };

  const startMSE = () => {
    try {
      if (!playerRef.current || !streamUrl) return;
      if (typeof ManagedMediaSource !== "undefined") {
        mediaSource = new ManagedMediaSource();
        playerRef.current.disableRemotePlayback = true;
        playerRef.current.srcObject = mediaSource;
      } else {
        mediaSource = new MediaSource();
        playerRef.current.src = URL.createObjectURL(mediaSource);
      }
      mediaSource.onsourceopen = function () {
        const ws = new WebSocket(streamUrl);
        wsRef.current = ws;
        ws.binaryType = "arraybuffer";
        ws.onopen = (_) => onConnected?.();
        ws.onerror = (event) => onError?.(event);
        ws.onmessage = function (event) {
          const data = new Uint8Array(event.data);
          // First packet is the codec type
          if (+data[0] === 9) {
            const mimeCodec = new TextDecoder("utf-8").decode(data.slice(1));
            try {
              mseSourceBuffer = mediaSource.addSourceBuffer(
                `video/mp4; codecs="${mimeCodec}"`
              );
            } catch (error) {
              onError?.(error);
              return;
            }
            buf = new Uint8Array(2 * 1024 * 1024);
            mseSourceBuffer.mode = "segments";
            mseSourceBuffer.onupdateend = pushPacket;
            // switch to readPacket after creating SourceBuffer
            ws.onmessage = readPacket;
          } else {
            readPacket(event);
          }
        };
      };
    } catch (err) {
      console.debug(err);
    }
  };

  React.useEffect(() => {
    // if the device is ios < 18 or safari < 17 then fallback to hls
    if (isIOSVersionLessThan18() || isSafariVersionLessThan17()) {
      startHLS();
    } else {
      startMSE();
    }
    return () => {
      cleanup();
    };
  }, [streamUrl]);

  return (
    <video
      onContextMenu={(e) => e.preventDefault()}
      id="video-player"
      autoPlay
      muted
      disablePictureInPicture
      playsInline
      ref={playerRef}
      onPlay={onPlay}
      onWaiting={onWaiting}
      onEnded={onEnded}
      onError={onError}
      {...props}
    />
  );
};

const isIOSVersionLessThan18 = () => {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) {
    const iOSVersionMatch = ua.match(/OS (\d+)_?(\d+)?/);
    if (iOSVersionMatch && parseInt(iOSVersionMatch[1], 10) < 18) {
      return true;
    }
  }
  return false;
};

const isSafariVersionLessThan17 = () => {
  const ua = navigator.userAgent;
  if (/^((?!chrome|android).)*safari/i.test(ua)) {
    const safariVersionMatch = ua.match(/Version\/(\d+)\.(\d+)/);
    if (safariVersionMatch && parseInt(safariVersionMatch[1], 10) < 17) {
      return true;
    }
  }
  return false;
};
