import React, { useEffect } from "react";
import { Formik } from "formik";
import CheckboxGroupField from "src/components/CheckboxGroupField";
import MonthPickerField from "src/components/MonthPickerField";
import {
  getInvoiceMinMaxYearAndMonth,
  getPreviousMonthsRange
} from "src/containers/Invoice";
import styles from "./InvoiceFilterForm.module.css";
import UserSearchSelect from "src/containers/User/Search/SearchSelector";
import { Link } from "pi-ui";

const DEFAULT_INITIAL_VALUES = {
  date: getPreviousMonthsRange(2),
  users: [],
  filters: {
    all: true,
    unreviewed: false,
    disputed: false,
    approved: false,
    rejected: false,
    paid: false
  }
};

const InvoiceFilterForm = ({ onChange, children, disableUserFilter }) => {
  return (
    <Formik initialValues={DEFAULT_INITIAL_VALUES}>
      {(formikProps) => {
        const { values, setFieldValue } = formikProps;
        const handleChangeUserSelector = (options) => {
          setFieldValue("users", options);
        };

        const handleLastMonths = (length) => (e) => {
          e && e.preventDefault();
          setFieldValue("date", getPreviousMonthsRange(length));
        };

        return (
          <>
            <form className={styles.form}>
              <div className={styles.topFilters}>
                <MonthPickerField
                  years={getInvoiceMinMaxYearAndMonth()}
                  name="date"
                  label="By Date"
                  toggleable
                  multiChoice
                  className={styles.monthPicker}
                />
                <div className={styles.checkboxesWrapper}>
                  <CheckboxGroupField
                    groupName="filters"
                    options={[
                      { name: "all", label: "All" },
                      { name: "unreviewed", label: "Unreviewed" },
                      { name: "disputed", label: "Disputed" },
                      { name: "approved", label: "Approved" },
                      { name: "rejected", label: "Rejected" },
                      { name: "paid", label: "Paid" }
                    ]}
                  />
                </div>
              </div>
              <div className={styles.presetDates}>
                Last:
                <Link onClick={handleLastMonths(3)} href="">
                  3 months
                </Link>
                <Link onClick={handleLastMonths(6)} href="">
                  6 months
                </Link>
                <Link onClick={handleLastMonths(12)} href="">
                  12 months
                </Link>
              </div>
              {!disableUserFilter && (
                <UserSearchSelect
                  onChange={handleChangeUserSelector}
                  className={styles.selector}
                  value={values.users}
                />
              )}
              <HookOnFormChange formikProps={formikProps} onChange={onChange} />
              <OnChangeFiltersModifier formikProps={formikProps} />
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

const OnChangeFiltersModifier = ({ formikProps }) => {
  const {
    values: { filters },
    setFieldValue
  } = formikProps;
  const { all, unreviewed, disputed, approved, rejected, paid } = filters;
  useEffect(() => {
    if (unreviewed || disputed || approved || rejected || paid) {
      setFieldValue("filters.all", false);
    }
  }, [unreviewed, disputed, approved, rejected, paid, setFieldValue]);

  useEffect(() => {
    if (all) {
      setFieldValue("filters", DEFAULT_INITIAL_VALUES.filters);
    }
  }, [all, setFieldValue]);
  return null;
};

export default InvoiceFilterForm;
