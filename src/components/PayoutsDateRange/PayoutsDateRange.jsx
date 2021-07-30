import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";

import MonthPickerField from "src/components/MonthPickerField";
import {
  getPayoutsMinMaxYearAndMonth,
  getInitialDateValue
} from "src/containers/Invoice";
import { getCurrentDateValue } from "src/helpers";
import styles from "./PayoutsDateRange.module.css";

const DEFAULT_INITIAL_VALUES = {
  sDate: getInitialDateValue(),
  eDate: getCurrentDateValue()
};

const datesRange = getPayoutsMinMaxYearAndMonth();

const PayoutsDateRange = ({ onChange, children }) => {
  return (
    <Formik initialValues={DEFAULT_INITIAL_VALUES}>
      {(formikProps) => {
        const { values } = formikProps;
        return (
          <>
            <form className={styles.form}>
              <MonthPickerField years={datesRange} name="sDate" label="Start" />
              <MonthPickerField
                className="margin-left-s"
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
