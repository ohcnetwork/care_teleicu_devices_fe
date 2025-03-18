import React from "react";

const getWindowDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * A hook that returns the current window dimensions.
 * @example
 * const { height, width } = useWindowDimensions();
 * @returns The current window dimensions.
 */
export default function useWindowDimensions() {
  const [value, setValue] = React.useState(getWindowDimensions());

  React.useEffect(() => {
    function handleResize() {
      setValue(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return value;
}
