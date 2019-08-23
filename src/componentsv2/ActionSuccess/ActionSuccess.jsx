import React from "react";
import PropTypes from "prop-types";
import { Icon, classNames, Text, useTheme, getThemeProperty } from "pi-ui";
import { Transition } from "react-transition-group";
import styles from "./ActionSuccess.module.css";

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

const ActionSuccess = ({ show, successMessage, className, iconSize }) => {
  const theme = useTheme();
  const greenColor = getThemeProperty(theme, "color-primary-light");
  return (
    <Transition in={show} exit={false} timeout={duration}>
      {state => (
        <div
          className={classNames(styles.wrapper, className)}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
            position: state === "exited" ? "absolute" : "initial"
          }}
        >
          <Icon
            type="checkmark"
            size={iconSize}
            backgroundColor={greenColor}
            iconColor={"white"}
          />
          <Text className="margin-top-s">{successMessage}</Text>
        </div>
      )}
    </Transition>
  );
};

ActionSuccess.propTypes = {
  successMessage: PropTypes.string,
  className: PropTypes.string,
  iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ActionSuccess.defaultProps = {
  iconSize: 100
};

export default ActionSuccess;
