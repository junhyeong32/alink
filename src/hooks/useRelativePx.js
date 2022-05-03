import { useState, useEffect, useCallback } from "react";

export default function useRelativePx() {
  const [device_width, setDeviceWidth] = useState();
  const [device_height, setDeviceHeight] = useState();

  useEffect(() => {
    if (device_width !== document.body.clientWidth)
      setDeviceWidth(document.body.clientWidth);

    if (device_height !== document.body.clientHeight)
      setDeviceHeight(document.body.clientHeight);
  }, []);

  const getRelativeWidthPx = useCallback(
    (px) => {
      return `${(px / 1920) * device_width || 0}px`;
    },
    [device_width]
  );

  const getRelativeHeightPx = useCallback(
    (px) => {
      return `${(px / 994) * device_height || 0}px`;
    },
    [device_width]
  );

  return {
    getRelativeWidthPx: getRelativeWidthPx,
    getRelativeHeightPx: getRelativeHeightPx,
  };
}
