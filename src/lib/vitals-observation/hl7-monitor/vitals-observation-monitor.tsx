import {
  NonWaveformContentGroup,
  NonWaveformData,
  WaveformLabels,
} from "@/lib/vitals-observation/helper-components";

import { I18NNAMESPACE } from "@/lib/constants";
import { WifiOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useVitalsObservation from "@/lib/vitals-observation/hl7-monitor/useVitalsObservation";

interface Props {
  socketUrl: string;
}

const VitalsObservationMonitor = ({ socketUrl }: Props) => {
  const { t } = useTranslation(I18NNAMESPACE);

  const { connect, waveformCanvas, data, isOnline } = useVitalsObservation();

  useEffect(() => {
    connect(socketUrl);
  }, [socketUrl]);

  return (
    <>
      <div
        className={cn(
          "flex-col gap-1 rounded-md p-2 max-w-4xl relative overflow-hidden bg-gray-950",
          isOnline ? "hidden" : "flex"
        )}
      >
        {/* Diagonal stripes overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #0a0a0a, #0a0a0a 10px, #171717 10px, #171717 20px)",
            backgroundSize: "28px 28px",
            opacity: 0.9,
          }}
        />
        <div className="flex flex-col items-center justify-center gap-1 p-1 text-center font-medium relative z-10 my-24 text-warning-400">
          <WifiOffIcon className="mb-2 animate-pulse text-4xl" />
          <span>{t("no_data_from_vitals_device")}</span>
        </div>
      </div>
      <div
        className={cn(
          "flex-col gap-1 rounded-lg bg-gray-950 p-2 max-w-4xl mx-auto",
          isOnline ? "flex" : "hidden"
        )}
      >
        <div className="relative flex flex-col gap-2 md:flex-row-reverse md:justify-between overflow-clip">
          <NonWaveformContentGroup>
            {/* Pulse Rate */}
            <NonWaveformData
              label={t("ecg")}
              attr={data.pulseRate?.value ? data.pulseRate : data.heartRate}
              className="text-green-400"
              suffix={
                <span className="animate-pulse font-sans text-red-500">❤️</span>
              }
            />

            {/* Blood Pressure */}
            <div className="flex flex-col p-1">
              <div className="flex w-full justify-between gap-2 font-bold text-orange-500">
                <span className="text-sm">{t("nibp")}</span>
                <span className="text-xs">
                  {data.bp?.systolic.unit ?? "--"}
                </span>
                <span className="text-xs">
                  {/* {data.bp?.["date-time"] && minutesAgo(data.bp?.["date-time"])} */}
                </span>
              </div>
              <div className="flex w-full justify-center text-sm font-medium text-orange-500">
                {t("sys_dia")}
              </div>
              <div className="flex w-full justify-center text-2xl font-black text-orange-300 md:text-4xl">
                <span>{data.bp?.systolic.value ?? "--"}</span>
                <span>/</span>
                <span>{data.bp?.diastolic.value ?? "--"}</span>
              </div>
              <div className="flex items-end">
                <span className="flex-1 text-sm font-bold text-orange-500">
                  {t("mean")}
                </span>
                <span className="flex-1 text-xl font-bold text-secondary-300">
                  {data.bp?.map.value ?? "--"}
                </span>
              </div>
            </div>

            {/* SpO2 */}
            <NonWaveformData
              label={t("spo2")}
              attr={data.spo2}
              className="text-yellow-300"
            />

            {/* Respiratory Rate */}
            <NonWaveformData
              label={t("resp")}
              attr={data.respiratoryRate}
              className="text-sky-300"
            />

            {/* Temperature */}
            <div className="col-span-2 flex flex-col p-1 md:col-span-1">
              <div className="flex w-full gap-2 font-bold text-fuchsia-400">
                <span className="text-sm">{t("temp")}</span>
                <span className="text-xs">
                  {data.temperature1?.unit?.replace("deg ", "°") ?? "--"}
                </span>
              </div>
              <div className="flex w-full justify-between gap-3 text-fuchsia-400">
                <div className="flex flex-col justify-start gap-1">
                  <span className="text-xs font-bold">{t("t1")}</span>
                  <span className="text-lg font-black md:text-2xl">
                    {data.temperature1?.value ?? "--"}
                  </span>
                </div>
                <div className="flex flex-col justify-start gap-1">
                  <span className="text-xs font-bold">{t("t2")}</span>
                  <span className="text-lg font-black md:text-2xl">
                    {data.temperature2?.value ?? "--"}
                  </span>
                </div>
                <div className="flex flex-col justify-start gap-1">
                  <span className="text-xs font-bold">{t("td")}</span>
                  <span className="text-lg font-black md:text-2xl">
                    {data.temperature1?.value && data.temperature2?.value
                      ? Math.abs(
                          data.temperature1?.value - data.temperature2?.value
                        )
                      : "--"}
                  </span>
                </div>
              </div>
            </div>
          </NonWaveformContentGroup>

          <div className="relative" style={waveformCanvas.size}>
            <WaveformLabels
              labels={{
                ECG: "text-lime-300",
                ECG_CHANNEL_2: "invisible",
                Pleth: "text-yellow-300",
                Resp: "text-sky-300",
              }}
            />
            <canvas
              className="absolute left-0 top-0"
              ref={waveformCanvas.background.canvasRef}
              style={waveformCanvas.size}
              {...waveformCanvas.size}
            />
            <canvas
              className="absolute left-0 top-0"
              ref={waveformCanvas.foreground.canvasRef}
              style={waveformCanvas.size}
              {...waveformCanvas.size}
            />
          </div>
        </div>
      </div>
    </>
  );
};

VitalsObservationMonitor.displayName = "VitalsMonitor";

export { VitalsObservationMonitor };
