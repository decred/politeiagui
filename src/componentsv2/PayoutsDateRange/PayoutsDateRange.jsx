import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";

import MonthPickerField from "src/componentsv2/MonthPicker/MonthPickerField";
import {
  getMinMaxYearAndMonth,
  getInitialDateValue,
  getPreviousMonthDateValue
} from "src/containers/Invoice";
import styles from "./PayoutsDateRange.module.css";

const DEFAULT_INITIAL_VALUES = {
  sDate: getPreviousMonthDateValue(),
  eDate: getInitialDateValue()
};

const datesRange = getMinMaxYearAndMonth();

const PayoutsDateRange = ({ onChange, children }) => {
  return (
    <Formik initialValues={DEFAULT_INITIAL_VALUES}>
      {formikProps => {
        const { values } = formikProps;
        return (
          <>
            <form className={styles.form}>
            <MonthPickerField
                years={datesRange}
                name="sDate"
                label="Start"
              />

              <MonthPickerField
                className={"margin-left-s"}
                years={datesRange}
                name="eDate"
                label="End"
              />
              <HookOnFormChange formikProps={formikProps} onChange={onChange} />
            </form>
            {children && children(values)}
          </>
        );
      }}
    </Formik>
  );
};

const HookOnFormChange = ({ formikProps, onChange }) => {
  useEffect(() => {
    onChange(formikProps.values);
  }, [formikProps.values, onChange]);
  return null;
};

PayoutsDateRange.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default PayoutsDateRange;
