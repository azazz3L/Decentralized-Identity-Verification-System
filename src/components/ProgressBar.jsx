import React from "react";
import { Progress } from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function ProgressBar() {
  const { theme } = useTheme();

  // Define custom classNames based on the theme
  const customClassNames = {
    indicator: theme === 'dark' ? 'bg-black' : 'bg-white', // Assuming bg-black and bg-white are defined in your CSS
    // Define other parts as needed...
  };

  return (
    <Progress
      size="md"
      isIndeterminate
      aria-label="Loading..."
      classNames={customClassNames}
    />
  );
}
