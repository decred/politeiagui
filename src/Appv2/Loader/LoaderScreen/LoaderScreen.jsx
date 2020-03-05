import React, { useEffect, useState } from "react";
import { Message, useTheme, classNames } from "pi-ui";
import logoLight from "src/assets/pi-logo-light.svg";
import logoDark from "src/assets/pi-logo-dark.svg";
import useLocalStorage from "src/hooks/utils/useLocalStorage";
import styles from "./LoaderScreen.module.css";

import { Transition } from "react-transition-group";

const duration = 300;

const defaultStyle = {
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
  const logoSrc = themeName === "dark" ? logoDark : logoLight;
  const [darkThemeOnLocalStorage] = useLocalStorage(
    "darkTheme",
    false
  );

  useEffect(() => {
    if (darkThemeOnLocalStorage && themeName === "light") {
      setThemeName("dark");
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
        {state => (
          <img
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
            alt="Politeia logo"
            src={logoSrc}
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
