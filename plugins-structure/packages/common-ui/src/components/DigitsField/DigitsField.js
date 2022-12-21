import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { NumberInput, classNames } from "pi-ui";
import styles from "./styles.module.css";

const getDigitsArrayFromCode = (code = "", length) => {
  let newDigits = code.split("").slice(0, length);
  if (newDigits.length < length) {
    const fillArray = Array(length - newDigits.length).fill("");
    newDigits = [...newDigits, ...fillArray];
  }
  return newDigits;
};

export const DigitsField = ({
  length,
  onChange,
  className,
  code,
  tabIndex,
  autoFocus,
  ...props
}) => {
  const [digits, setDigits] = useState(getDigitsArrayFromCode(code, length));
  const [focused, setFocused] = useState();
  const inputRef = useRef(null);

  const handleChangeDigit = (e) => {
    e && e.preventDefault();
    const newCode = e.target.value.toString();
    const numbersOnlyCode = newCode.replace(/^\D+/g, "");
    const newVal = getDigitsArrayFromCode(numbersOnlyCode, length).join("");
    onChange(newVal);
  };

  useEffect(() => {
    setDigits(getDigitsArrayFromCode(code, length));
  }, [code, length]);

  // Both useEffects are used to trigger the input focus
  // on render because useEffect does not recognize changes
  // for references, therefore, inputRef cannot be used as
  // a dependency
  useEffect(() => {
    focused && inputRef.current.focus();
  }, [focused]);

  useEffect(() => {
    setFocused(autoFocus);
  }, [autoFocus]);

  return (
    <>
      <input
        type="number"
        className={styles.mainInput}
        onChange={handleChangeDigit}
        value={digits.join("")}
        ref={inputRef}
        onBlur={() => {
          !autoFocus && setFocused(false);
        }}
        {...props}
      />
      <div
        className={classNames(
          className,
          styles.digitsWrapper,
          focused && styles.focusedInput
        )}
      >
        {digits.map((value, index) => {
          return (
            <NumberInput
              readOnly
              id={`id-digit-${index}`}
              key={`digit-${index}`}
              defaultValue={value}
              tabIndex={tabIndex}
              onFocus={() => {
                inputRef.current.focus();
                setFocused(true);
              }}
            />
          );
        })}
      </div>
    </>
  );
};

DigitsField.propTypes = {
  length: PropTypes.number,
  onChange: PropTypes.func,
  className: PropTypes.string,
  code: PropTypes.string,
  tabIndex: PropTypes.number,
  autoFocus: PropTypes.bool,
};

DigitsField.defaultProps = {
  tabIndex: 1,
  length: 6,
  onChange: () => {},
  autoFocus: false,
};
