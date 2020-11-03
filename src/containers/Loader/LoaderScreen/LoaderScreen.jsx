import React, { useEffect, useState } from "react";
import {
  Message,
  useTheme,
  classNames,
  DEFAULT_LIGHT_THEME_NAME,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import styles from "./LoaderScreen.module.css";
import Logo from "src/components/Logo";
import useLocalStorage from "src/hooks/utils/useLocalStorage";

import { Transition } from "react-transition-group";

const duration = 300;

const defaultStyle = {
  maxWidth: "20rem",
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 }
};

const LoaderScreen = ({ error }) => {
  const [mounted, setMounted] = useState(false);
  const { themeName, setThemeName } = useTheme();
  const [darkThemeOnLocalStorage] = useLocalStorage("darkTheme", false);

  useEffect(() => {
    if (darkThemeOnLocalStorage && themeName === DEFAULT_LIGHT_THEME_NAME) {
      setThemeName(DEFAULT_DARK_THEME_NAME);
    }
  }, [darkThemeOnLocalStorage, setThemeName, themeName]);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <div className={classNames(styles.container, styles.dark)}>
      <Transition in={mounted} timeout={duration}>
        {(state) => (
          <Logo
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          />
        )}
      </Transition>
      {error && (
        <Message className="margin-top-m" kind="error">
          {error.toString()}
        </Message>
      )}
    </div>
  );
};

export default LoaderScreen;
