import React from "react";
import {
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  DarkLightToggle,
} from "pi-ui";
import { selectCurrentTheme, setCurrentTheme } from "./themeSlice";
import { useDispatch, useSelector } from "react-redux";

export function ThemeToggle() {
  const dispatch = useDispatch();
  const themeName = useSelector(selectCurrentTheme);
  const setThemeName = (name) => dispatch(setCurrentTheme(name));
  return (
    <div>
      <DarkLightToggle
        onToggle={() =>
          themeName === DEFAULT_DARK_THEME_NAME
            ? setThemeName(DEFAULT_LIGHT_THEME_NAME)
            : setThemeName(DEFAULT_DARK_THEME_NAME)
        }
        toggled={themeName === DEFAULT_DARK_THEME_NAME}
      />
    </div>
  );
}
