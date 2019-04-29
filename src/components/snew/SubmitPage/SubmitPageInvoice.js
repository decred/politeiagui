import React, { useState, useEffect } from "react";
import ReactBody from "react-body";
import ErrorField from "../../Form/Fields/ErrorField";
import SelectField from "../../Form/Fields/SelectField";
import InputFieldWithError from "../../Form/Fields/InputFieldWithError";
import ButtonWithLoadingIcon from "../ButtonWithLoadingIcon";
import Message from "../../Message";
import { Field } from "redux-form";
import InvoiceDatasheetField from "../../Form/Fields/InvoiceDatasheetField";
import DynamicDataDisplay from "../../DynamicDataDisplay";
import {
  fromUSDCentsToUSDUnits,
  getCurrentYear,
  getCurrentMonth
} from "../../../helpers";

const YEAR_OPTIONS = [2018, 2019];
const MONTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const InvoiceSubmit = props => {
  const {
    isLoading,
    onSave,
    onCancel,
    submitting,
    handleSubmit,
    submitError,
    editingMode,
    valid,
    month,
    year,
    onFetchExchangeRate,
    loadingExchangeRate,
    exchangeRate,
    exchangeRateError,
    change
  } = props;

  const [datasheetErrors, setDatasheetErrors] = useState([]);
  const [monthOptions, setMonthOptions] = useState(MONTH_OPTIONS);

  useEffect(() => {
    // limit the months options up to the current month if
    // year is the current year
    if (+year === getCurrentYear()) {
      const newMonths = MONTH_OPTIONS.slice(0, getCurrentMonth() - 1);
      setMonthOptions(newMonths);
    } else {
      setMonthOptions(MONTH_OPTIONS);
    }
  }, [year]);

  const submitEnabled =
    !submitting &&
    valid &&
    datasheetErrors.length === 0 &&
    !exchangeRateError &&
    !loadingExchangeRate;

  const handleFetchExchangeRate = () => {
    if (month && year) {
      onFetchExchangeRate(month, year);
    }
  };

  const handleYearChange = (event, value) => {
    // reset month value to 1 on every year change
    change("month", 1);
    change("year", value);
  };

  return (
    <div className="content" role="main">
      <div className="page submit-proposal-page">
        <ReactBody className="submit-page" />
        <div className="submit conztent warn-on-unload" id="newlink">
          {submitError ? (
            <Message
              type="error"
              header={`Error ${editingMode ? "updating" : "creating"} invoice`}
              body={submitError}
            />
          ) : null}
          <div className="formtabs-content">
            <div className="spacer">
              <Field
                name="global"
                component={props => (
                  <ErrorField title="Cannot submit invoice" {...props} />
                )}
              />
              <div className="roundfield" id="title-field">
                <div className="roundfield-content">
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "flex-end"
                    }}
                  >
                    <Field
                      name="month"
                      component={SelectField}
                      options={monthOptions}
                      tabIndex={1}
                      label="Month"
                    />
                    <Field
                      name="year"
                      component={SelectField}
                      tabIndex={1}
                      type="text"
                      options={YEAR_OPTIONS}
                      label="Year"
                      onChange={handleYearChange}
                    />

                    <DynamicDataDisplay
                      onFetch={handleFetchExchangeRate}
                      refreshTriggers={[month, year]}
                      isLoading={loadingExchangeRate}
                      error={exchangeRateError}
                      loadingMessage="Updating exchange rate..."
                      style={{
                        marginLeft: "10px",
                        fontSize: "0.75em",
                        maxWidth: "200px",
                        paddingBottom: "10px"
                      }}
                    >
                      <span>
                        Exchange Rate:{" "}
                        <b>{`${fromUSDCentsToUSDUnits(exchangeRate)} USD`}</b>
                      </span>
                    </DynamicDataDisplay>
                  </div>
                  <div className="usertext">
                    <Field
                      name="name"
                      label="Contractor name"
                      type="text"
                      component={InputFieldWithError}
                    />
                    <Field
                      name="location"
                      label="Contractor location"
                      type="text"
                      component={InputFieldWithError}
                    />
                    <Field
                      name="contact"
                      label="Contractor contact"
                      type="text"
                      component={InputFieldWithError}
                    />
                    <Field
                      name="rate"
                      label="Contractor rate (USD)"
                      type="number"
                      component={InputFieldWithError}
                    />
                    <Field
                      name="address"
                      label="Payment address"
                      type="text"
                      component={InputFieldWithError}
                    />
                  </div>
                  <div className="usertext">
                    <Field
                      name="datasheet"
                      onChangeErrors={setDatasheetErrors}
                      errors={datasheetErrors}
                      component={InvoiceDatasheetField}
                    />
                  </div>
                  <div className="submit-wrapper">
                    <ButtonWithLoadingIcon
                      className={`togglebutton access-required${!submitEnabled &&
                        " not-active disabled"}`}
                      name="submit"
                      type="submit"
                      value="form"
                      text={!editingMode ? "submit" : "update"}
                      onClick={handleSubmit(onSave)}
                      isLoading={isLoading}
                    />
                    {editingMode ? (
                      <ButtonWithLoadingIcon
                        className="togglebutton access-required"
                        name="cancel"
                        text="Cancel"
                        onClick={onCancel}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSubmit;
