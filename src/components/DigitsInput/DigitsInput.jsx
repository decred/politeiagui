import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { NumberInput, classNames } from "pi-ui";
import styles from "./DigitsInput.module.css";

const getDigitsArrayFromCode = (code = "", length) => {
  let newDigits = code.split("").slice(0, length);
  if (newDigits.length < length) {
    const fillArray = Array(length - newDigits.length).fill("");
    newDigits = [...newDigits, ...fillArray];
  }
  return newDigits;
};

const DigitsInput = ({
  length,
  onChange,
  className,
  code,
  tabIndex,
  autoFocus
}) => {
  const [digits, setDigits] = useState(getDigitsArrayFromCode(code, length));
  const [focused, setFocused] = useState();
  const inputRef = useRef(null);

  const handleChangeDigit = (e) => {
    e && e.preventDefault();
    const newCode = e.target.value.toString();
    const numbersOnlyCode = newCode.replace(/^\D+/g, "");
    onChange(getDigitsArrayFromCode(numbersOnlyCode, length).join(""));
  };

  useEffect(() => {
    setDigits(getDigitsArrayFromCode(code, length));
  }, [code, length]);

  const onChangeDigit = (index) => {
    const newDigits = [...digits];
    newDigits[index] = "";
    inputRef.current.selectionStart = index;
    inputRef.current.selectionEnd = index + 1;
    inputRef.current.focus();
  };

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
        type="text"
        className={styles.mainInput}
        onChange={handleChangeDigit}
        value={digits.join("")}
        ref={inputRef}
        onBlur={() => {
          !autoFocus && setFocused(false);
        }}
      />
      <div
        className={classNames(
          className,
          styles.digitsWrapper,
          focused && styles.focusedInput
        )}>
        {digits.map((value, index) => {
          return (
            <NumberInput
              id={`id-digit-${index}`}
              key={`digit-${index}`}
              defaultValue={value}
              tabIndex={tabIndex}
              onFocus={(e) => {
                e && e.target && e.target.value
                  ? onChangeDigit(index)
                  : inputRef.current.focus();
                setFocused(true);
              }}
            />
          );
        })}
      </div>
    </>
  );
};

DigitsInput.propTypes = {
  length: PropTypes.number,
  onChange: PropTypes.func,
  className: PropTypes.string,
  code: PropTypes.string,
  tabIndex: PropTypes.number,
  autoFocus: PropTypes.bool
};

DigitsInput.defaultProps = {
  tabIndex: 1,
  length: 6,
  onChange: () => {},
  onFill: () => {},
  autoFocus: false
};

export default DigitsInput;
