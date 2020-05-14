import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text, classNames, Checkbox, DatePicker } from "pi-ui";
import { FormikConsumer } from "formik";
import styles from "./MonthPickerField.module.css";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { sortDateRange } from "src/containers/Invoice";
import { MONTHS_LABELS } from "src/constants";

const isAllMonths = (date) => date.month === "all";
const isRange = (date) => date && date.start && date.end;

const makeText = (m) => {
  if (m && m.year && m.month) {
    return !isAllMonths(m)
      ? `${MONTHS_LABELS[m.month - 1]} ${m.year}`
      : `${m.year}`;
  }
  if (isRange(m)) {
    return `${MONTHS_LABELS[m.start.month - 1]} ${m.start.year} - ${
      MONTHS_LABELS[m.end.month - 1]
    } ${m.end.year}`;
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
  multiChoice,
  enableAllMonths
}) => {
  const [isDisabled, setDisabled] = useState(false);
  const [isOpen, openPicker, closePicker] = useBooleanState(false);
  const [initialRange, setInitialRange] = useState();
  const togglePicker = () => {
    if (!isOpen) {
      openPicker();
    } else {
      closePicker();
    }
  };
  const clearInitialRange = () => {
    setInitialRange();
  };

  return (
    <FormikConsumer>
      {({ setFieldValue, values, initialValues }) => {
        const onChange = (year, month) => {
          if (!year || !month) {
            closePicker();
            return;
          }
          if (month === "all") {
            setFieldValue(name, { year, month });
            closePicker();
            return;
          }
          if (!multiChoice) {
            setFieldValue(name, { year, month });
            closePicker();
            return;
          }
          if (initialRange) {
            setFieldValue(name, sortDateRange(initialRange, { year, month }));
            clearInitialRange();
            closePicker();
            return;
          } else {
            setInitialRange({ year, month });
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
                enableAllMonths={enableAllMonths}
                years={years}
                values={values[name]}
                multiChoice={multiChoice}
                lang={MONTHS_LABELS}
                onChange={onChange}>
                <span
                  className={classNames(
                    styles.valueWrapper,
                    readOnly && "cursor-not-allowed"
                  )}
                  onClick={togglePicker}>
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
