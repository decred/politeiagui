import React, { useState, useEffect, useCallback } from "react";
import ReactBody from "react-body";
import ErrorField from "../../Form/Fields/ErrorField";
import SelectField from "../../Form/Fields/SelectField";
import { FilesField, normalizer } from "../../Form/Fields/FilesField";
import InputFieldWithError from "../../Form/Fields/InputFieldWithError";
import ButtonWithLoadingIcon from "../ButtonWithLoadingIcon";
import Markdown from "../Markdown";
import Message from "../../Message";
import { Field } from "redux-form";
import InvoiceDatasheetField from "../../Form/Fields/InvoiceDatasheetField";
import DynamicDataDisplay from "../../DynamicDataDisplay";
import {
  fromUSDCentsToUSDUnits,
  getCurrentYear,
  getCurrentMonth
} from "../../../helpers";
import { invoiceInstructions } from "./helpers";

const YEAR_OPTIONS = [2018, 2019, 2020];
const MONTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const InvoiceSubmit = (props) => {
  const {
    isLoading,
    onSave,
    onCancel,
    submitting,
    handleSubmit,
    submitError,
    editingMode,
    month,
    year,
    onFetchExchangeRate,
    loadingExchangeRate,
    exchangeRate,
    exchangeRateError,
    change,
    policy,
    userCanExecuteActions,
    loggedInAsEmail,
    valid,
    pristine,
    onSaveInvoiceDraft,
    draftInvoiceById,
    isDraftSaving,
    draftButtonText
  } = props;
  const [monthOptions, setMonthOptions] = useState(MONTH_OPTIONS);
  const [contractorRate, setContractorRate] = useState(0);

  const yearOptions =
    getCurrentMonth() === 1
      ? YEAR_OPTIONS.slice(0, YEAR_OPTIONS.length - 1)
      : YEAR_OPTIONS;

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

  // Form is considered 'pristine' if the user has not modified
  // the invoice since saving the draft. To work around this,
  // the (!pristine || draftInvoiceById) condition is used
  const submitEnabled =
    loggedInAsEmail &&
    !submitting &&
    valid &&
    (!pristine || draftInvoiceById) &&
    !exchangeRateError &&
    !loadingExchangeRate;

  const handleFetchExchangeRate = useCallback(() => {
    if (month && year) {
      onFetchExchangeRate(month, year);
    }
  }, [month, year, onFetchExchangeRate]);

  const handleYearChange = (event, value) => {
    // reset month value to 1 on every year change
    change("month", 1);
    change("year", value);
  };

  const handleContractorRateChange = (e) =>
    !isNaN(e.target.valueAsNumber)
      ? setContractorRate(e.target.valueAsNumber)
      : setContractorRate(0);

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
                component={(props) => (
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
                    }}>
                    <Field
                      name="month"
                      component={SelectField}
                      options={monthOptions}
                      tabIndex={1}
                      disabled={editingMode}
                      label="Month"
                    />
                    <Field
                      name="year"
                      component={SelectField}
                      tabIndex={1}
                      type="text"
                      options={yearOptions}
                      label="Year"
                      disabled={editingMode}
                      onChange={handleYearChange}
                    />

                    <DynamicDataDisplay
                      onFetch={handleFetchExchangeRate}
                      refreshTriggers={[month, year]}
                      isLoading={loadingExchangeRate}
                      error={exchangeRateError}
                      errorTitle={"Failed to fetch exchange rate"}
                      loadingMessage="Updating exchange rate..."
                      style={{
                        marginLeft: "10px",
                        fontSize: "0.75em",
                        maxWidth: "200px",
                        paddingBottom: "10px"
                      }}>
                      <span>
                        Exchange Rate:{" "}
                        <b>{`${fromUSDCentsToUSDUnits(exchangeRate)} USD`}</b>
                      </span>
                    </DynamicDataDisplay>
                  </div>
                  <div
                    className="usertext"
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                    <div
                      style={{
                        paddingRight: "20px"
                      }}>
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
                        onChange={handleContractorRateChange}
                      />
                      <Field
                        name="address"
                        label="Payment address"
                        type="text"
                        component={InputFieldWithError}
                      />
                    </div>
                    <div>
                      {policy && (
                        <Markdown
                          body={invoiceInstructions(policy)}
                          filterXss={false}
                          confirmWithModal={null}
                          displayExternalLikWarning={false}
                          {...props}
                        />
                      )}
                    </div>
                  </div>
                  <div className="usertext">
                    <Field
                      name="lineitems"
                      component={InvoiceDatasheetField}
                      policy={policy}
                      userRate={contractorRate}
                    />
                  </div>
                  <div>
                    <Field
                      name="files"
                      className="attach-button greenprimary"
                      component={FilesField}
                      userCanExecuteActions={userCanExecuteActions}
                      placeholder="Attach a file"
                      policy={policy}
                      normalize={normalizer}
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
                    <ButtonWithLoadingIcon
                      className={"togglebutton secondary access-required"}
                      name="submit"
                      type="submit"
                      value="form"
                      text={draftButtonText}
                      onClick={handleSubmit(onSaveInvoiceDraft)}
                      isLoading={isDraftSaving}
                    />
                    {editingMode ? (
                      <ButtonWithLoadingIcon
                        className={`togglebutton access-required${isLoading &&
                          " not-active disabled"}`}
                        name="cancel"
                        text="Cancel"
                        onClick={onCancel}
                      />
                    ) : null}
                    <p
                      style={{
                        fontSize: "16px",
                        display: "flex",
                        paddingTop: "1em"
                      }}>
                      <b>NOTE:&nbsp;</b> Drafts are locally stored in the
                      browser and will NOT be available across different
                      browsers or devices.
                    </p>
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
