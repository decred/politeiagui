import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text, classNames, Checkbox, DatePicker } from "pi-ui";
import { FormikConsumer } from "formik";
import styles from "./MonthPickerField.module.css";
import useBooleanState from "src/hooks/utils/useBooleanState";

const pickerLang = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};

const makeText = (m) => {
  if (m && m.year && m.month)
    return `${pickerLang.months[m.month - 1]} ${m.year}`;
  return "?";
};

const Arrow = ({ isOpen }) => {
  return (
    <div className={isOpen ? styles.arrowAnchorOpen : styles.arrowAnchor} />
  );
};

const MonthPickerField = ({ name, label, years, readOnly, toggleable, className }) => {
  const [isDisabled, setDisabled] = useState(false);
  const [isOpen, openPicker, closePicker] = useBooleanState(false);
  const togglePicker = () => {
    if(!isOpen) {
      openPicker();
    } else {
      closePicker();
    }
  };
  return (
    <FormikConsumer>
      {({ setFieldValue, values, initialValues }) => {
        const onChange = (year, month) => {
          if (!!year && !!month) {
            setFieldValue(name, { year, month });
          }
          closePicker();
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

            <div>
              {isDisabled ? (
                <span className="cursor-not-allowed">Any</span>
              ) : (
                <DatePicker
                  show={isOpen && !readOnly}
                  isMonthsMode={true}
                  years={years}
                  value={values[name]}
                  lang={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                  onChange={onChange}
                  onDismiss={onChange}>
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
