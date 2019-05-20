import React, { useState, useEffect } from "react";
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

const YEAR_OPTIONS = [2018, 2019];
const MONTH_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const invoiceInstructions = `
***Contractor Name:*** This is whatever name you identify yourself with the DHG, typically something beyond a mere handle or nick.

***Contractor Location:*** This is the country you are currently located, or primarily residing.

***Contractor Contact:*** Contact information in case an administrator would need to reach out to discuss something, typically an email address or chat nick.

***Contractor Rate:*** This is the previously agreed upon rate you will be performing work.

***Payment Address:*** This is the DCR address where you would like to receive payment.  

***Line Items:***
  * Type: Currently can be 1 (Labor), 2 (Expense), or 3 (Misc)
  * Domain: The broad category of work performed/expenses spent (for example, Development, Marketing, Community etc).
  * Subdomain: The specific project or program of which the work or expenses are related (for example, Decrediton, dcrd, NYC Event).
  * Description: A thorough description of the work or expenses.
  * Labor: The number of hours of work performed.
  * Expenses: The cost of the line item (in USD).`;

const InvoiceSubmit = props => {
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
    valid
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
    loggedInAsEmail &&
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
                      errorTitle={"Failed to fetch exchange rate"}
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
                  <div
                    className="usertext"
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <div
                      style={{
                        paddingRight: "20px"
                      }}
                    >
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
                    <div>
                      <Markdown
                        body={invoiceInstructions}
                        filterXss={false}
                        confirmWithModal={null}
                        displayExternalLikWarning={false}
                        {...props}
                      />
                    </div>
                  </div>
                  <div className="usertext">
                    <Field
                      name="lineitems"
                      onChangeErrors={setDatasheetErrors}
                      errors={datasheetErrors}
                      component={InvoiceDatasheetField}
                      policy={policy}
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
                    {editingMode ? (
                      <ButtonWithLoadingIcon
                        className={`togglebutton access-required${isLoading &&
                          " not-active disabled"}`}
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
