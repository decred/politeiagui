import React, { useEffect, useState } from "react";
import { Message } from "pi-ui";
import piLogo from "src/assets/pi-logo-light.svg";
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
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <div className={styles.container}>
      <Transition in={mounted} timeout={duration}>
        {state => (
          <img
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
            alt="Politeia logo"
            src={piLogo}
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
