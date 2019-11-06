import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Picker from "react-month-picker";
import "react-month-picker/css/month-picker.css";
import { Text, classNames } from "pi-ui";
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
  ],
  from: "From",
  to: "To"
};

const makeText = m => {
  if (m && m.year && m.month)
    return pickerLang.months[m.month - 1] + " " + m.year;
  return "?";
};

const Arrow = ({ isOpen }) => {
  return (
    <div className={isOpen ? styles.arrowAnchorOpen : styles.arrowAnchor} />
  );
};

const MonthPickerField = ({ name, label, years, readOnly }) => {
  const [isOpen, openPicker, closePicker] = useBooleanState(false);
  const ref = useRef();

  useEffect(() => {
    if (isOpen && !readOnly) {
      ref.current.show();
    }
  }, [isOpen, readOnly]);
  return (
    <FormikConsumer>
      {({ setFieldValue, values }) => {
        const onChange = (year, month) => {
          if (!!year && !!month) {
            setFieldValue(name, { year, month });
          }
          closePicker();
        };
        return (
          <div>
            <Text color="gray">{label}</Text>
            <div>
              <Picker
                ref={ref}
                years={years}
                value={values[name]}
                onChange={onChange}
                onDismiss={onChange}
              >
                <span
                  className={classNames(
                    styles.valueWrapper,
                    readOnly && "cursor-not-allowed"
                  )}
                  onClick={openPicker}
                >
                  {makeText(values[name])}
                  {!readOnly && <Arrow isOpen={isOpen} />}
                </span>
              </Picker>
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
  readOnly: PropTypes.bool
};

MonthPickerField.defaultProps = {
  readOnly: false
};

export default MonthPickerField;
