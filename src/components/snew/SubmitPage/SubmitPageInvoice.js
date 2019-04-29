import React, { useState } from "react";
import ReactBody from "react-body";
import ErrorField from "../../Form/Fields/ErrorField";
import SelectField from "../../Form/Fields/SelectField";
import InputFieldWithError from "../../Form/Fields/InputFieldWithError";
import ButtonWithLoadingIcon from "../ButtonWithLoadingIcon";
import Message from "../../Message";
import { Field } from "redux-form";
import InvoiceDatasheetField from "../../Form/Fields/InvoiceDatasheetField";
import DynamicDataDisplay from "../../DynamicDataDisplay";
import { fromUSDCentsToUSDUnits } from "../../../helpers";

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
    exchangeRateError
  } = props;

  const [datasheetErrors, setDatasheetErrors] = useState([]);
  const submitEnabled = !submitting && valid && datasheetErrors.length === 0;
  const handleFetchExchangeRate = () => {
    if (month && year) {
      onFetchExchangeRate(month, year);
    }
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
                      options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                      tabIndex={1}
                      label="Month"
                    />
                    <Field
                      name="year"
                      component={SelectField}
                      tabIndex={1}
                      type="text"
                      options={[2019, 2020, 2021, 2022, 2023, 2024, 2025]}
                      label="Year"
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
