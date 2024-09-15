import banData, { type BanData } from "@/constants/bans.json";
import { createSignal } from "solid-js";

export const useBanData = () => {
  const [canResetViewport, setCanResetViewport] = createSignal(false);
  const [isResettingViewport, setIsResettingViewport] = createSignal(false);

  const getBanDataByLocation = (location: keyof BanData) => {
    return banData[location];
  };

  return {
    data: banData,
    canResetViewport,
    isResettingViewport,
    setCanResetViewport,
    setIsResettingViewport,
    getBanDataByLocation,
  };
};
