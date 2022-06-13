import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text, classNames, Checkbox, DatePicker } from "pi-ui";
import { FormikConsumer } from "formik";
import styles from "./MonthPickerField.module.css";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { MONTHS_LABELS } from "src/constants";

const isSecondSelection = (index) => index === 1;
const isRange = (values) => values instanceof Array;

const makeText = (m) => {
  if (m && m.year && m.month) {
    return `${MONTHS_LABELS[m.month - 1]} ${m.year}`;
  }
  if (isRange(m)) {
    const firstDateLabel = m[0]
      ? `${MONTHS_LABELS[m[0].month - 1]} ${m[0].year}`
      : "";
    const secondDateLabel = m[1]
      ? `${MONTHS_LABELS[m[1].month - 1]} ${m[1].year}`
      : "";
    return firstDateLabel === secondDateLabel
      ? firstDateLabel
      : `${firstDateLabel} - ${secondDateLabel}`;
  }
  return "?";
};

const Arrow = ({ isOpen }) => {
  return (
    <div className={isOpen ? styles.arrowAnchorOpen : styles.arrowAnchor} />
  );
};

const MonthPickerField = ({
  name,
  label,
  years,
  readOnly,
  toggleable,
  className,
  multiChoice
}) => {
  const [isDisabled, setDisabled] = useState(false);
  const [isOpen, openPicker, closePicker] = useBooleanState(false);
  const togglePicker = () => {
    if (!isOpen) {
      openPicker();
    } else {
      closePicker();
    }
  };

  return (
    <FormikConsumer>
      {({ setFieldValue, values, initialValues }) => {
        const onChange = (year, month, idx) => {
          const selectedDate = { year, month };
          if (!year || !month) {
            closePicker();
            return;
          }
          if (!multiChoice) {
            setFieldValue(name, { year, month });
            closePicker();
            return;
          }
          if (values[name].length) {
            const newValues = [...values[name]];
            newValues[idx] = { year, month };
            setFieldValue(name, newValues);
            return;
          } else {
            setFieldValue(name, [selectedDate, selectedDate]);
          }
          if (isSecondSelection(idx)) {
            closePicker();
            return;
          }
        };

        const handleToggle = () => {
          const newValue = !isDisabled;
          setDisabled(newValue);
          if (newValue) {
            setFieldValue(name, { year: "", month: "" });
          } else {
            setFieldValue(name, initialValues[name]);
          }
        };

        return (
          <div className={className}>
            <div style={{ display: "flex" }}>
              {toggleable && (
                <Checkbox
                  id="checkMonth"
                  checked={!isDisabled}
                  onChange={handleToggle}
                />
              )}
              <Text color="gray">{label}</Text>
            </div>
            {isDisabled ? (
              <span className="cursor-not-allowed">Any</span>
            ) : (
              <DatePicker
                show={isOpen && !readOnly}
                isMonthsMode={true}
                isRange={multiChoice}
                years={years}
                value={values[name]}
                lang={MONTHS_LABELS}
                onChange={onChange}
              >
                <span
                  className={classNames(
                    styles.valueWrapper,
                    readOnly && "cursor-not-allowed"
                  )}
                  onClick={togglePicker}
                >
                  {makeText(values[name])}
                  {!readOnly && <Arrow isOpen={isOpen} />}
                </span>
              </DatePicker>
            )}
          </div>
        );
      }}
    </FormikConsumer>
  );
};

MonthPickerField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  year: PropTypes.object,
  readOnly: PropTypes.bool,
  className: PropTypes.string
};

MonthPickerField.defaultProps = {
  readOnly: false
};

export default MonthPickerField;
