import React, { useState } from "react";
import PropTypes from "prop-types";
import { Text, classNames, Checkbox, DatePicker } from "pi-ui";
import { useFormikContext } from "formik";
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

const isSecondSelection = (index) => index === 1;
const isRange = (values) => values instanceof Array;

const makeText = (m) => {
  if (m && m.year && m.month) {
    return `${pickerLang.months[m.month - 1]} ${m.year}`;
  }
  if (isRange(m)) {
    const firstDateLabel = m[0]
      ? `${pickerLang.months[m[0].month - 1]} ${m[0].year}`
      : "";
    const secondDateLabel = m[1]
      ? `${pickerLang.months[m[1].month - 1]} ${m[1].year}`
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
  const { setFieldValue, values, initialValues } = useFormikContext();

  const togglePicker = () => {
    if (!isOpen) {
      openPicker();
    } else {
      closePicker();
    }
  };

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
          lang={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
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
