import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@nextui-org/react";
import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

export default function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const handleChange = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <Switch
      checked={isDarkMode}
      size="sm"
      color="secondary"
      onChange={handleChange}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} /> // Display SunIcon when dark mode is active
        ) : (
          <MoonIcon className={className} /> // Display MoonIcon when light mode is active
        )
      }
    />
  );
}
