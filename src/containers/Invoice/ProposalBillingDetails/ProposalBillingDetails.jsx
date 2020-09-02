import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Spinner, Card, Table, H3, Message } from "pi-ui";
import { useProposalBillingDetails } from "./hooks";
import { GoBackLink } from "src/components/Router";
import get from "lodash/fp/get";
import Link from "src/components/Link";
import { usdFormatter, formatCentsToUSD } from "src/utils";
import { fromMinutesToHours } from "src/helpers";
import {
  getInvoiceTotalLabor,
  getInvoiceTotalExpenses,
  getInvoiceTotal,
  getSubContractorTotal,
  TABLE_HEADERS,
  getSubContractorTotalLabor,
  getSubContractorRate,
  getSubContractor
} from "./helpers";
import styles from "./ProposalBillingDetails.module.css";
import { useSubContractors } from "src/hooks";

const SubContractorReference = ({ username = "", userid = "", value }) => {
  const [show, setShow] = useState();
  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className={styles.value}>
      {value}*
      {show && (
        <Link className={styles.reference} to={`/user/${userid}`}>
          <b>Sub Contractor:</b> {username}
        </Link>
      )}
    </div>
  );
};

const getDetailsData = (invoices, subContractors) =>
  (invoices &&
    invoices.map(({ username, userid, censorshiprecord: { token }, input }) => {
      const totalUsd = getInvoiceTotal(input.contractorrate, input.lineitems);
      const totalDcr = totalUsd / input.exchangerate;
      const totalLabor = getInvoiceTotalLabor(input.lineitems);
      const totalExpenses = getInvoiceTotalExpenses(input ? { input } : null);
      const subContractorTotalLabor = getSubContractorTotalLabor(
        input.lineitems
      );
      let detailsData = {
        User: <Link to={`/user/${userid}`}>{username}</Link>,
        "Contractor Rate": usdFormatter.format(input.contractorrate / 100),
        "Exchange Rate": usdFormatter.format(input.exchangerate / 100),
        "Labor (hours)": fromMinutesToHours(totalLabor),
        "Expense (USD)": usdFormatter.format(totalExpenses),
        "Total (DCR)": totalDcr.toFixed(8),
        "Total (USD)": usdFormatter.format(totalUsd / 100),
        Invoice: <Link to={`/invoices/${token}`}>{token}</Link>
      };
      if (subContractorTotalLabor && !totalExpenses) {
        const subContractorTotal = getSubContractorTotal(input.lineitems);
        const subContractorTotalDcr = subContractorTotal / input.exchangerate;
        const subContractorRate = getSubContractorRate(input.lineitems);
        const { username, id } = getSubContractor(
          input.lineitems,
          subContractors
        );
        detailsData = {
          ...detailsData,
          "Total (USD)": (
            <SubContractorReference
              value={usdFormatter.format(subContractorTotal / 100)}
              username={username}
              userid={id}
            />
          ),
          "Total (DCR)": (
            <SubContractorReference
              value={subContractorTotalDcr.toFixed(8)}
              username={username}
              userid={id}
            />
          ),
          "Labor (hours)": (
            <SubContractorReference
              value={fromMinutesToHours(subContractorTotalLabor)}
              username={username}
              userid={id}
            />
          ),
          "Contractor Rate": (
            <SubContractorReference
              value={usdFormatter.format(subContractorRate / 100)}
              username={username}
              userid={id}
            />
          )
        };
      }
      return detailsData;
    })) ||
  [];

const ProposalBillingDetails = ({ TopBanner, PageDetails, Main, match }) => {
  const [error, setError] = useState();
  const tokenFromUrl = get("params.token", match);
  const {
    getSpendingDetails,
    proposalBillingDetails,
    loading
  } = useProposalBillingDetails(tokenFromUrl);

  const {
    subContractors,
    loading: loadingSubContractors,
    error: subContractorsError
  } = useSubContractors();

  useEffect(() => {
    getSpendingDetails(tokenFromUrl).catch((e) => setError(e));
  }, [getSpendingDetails, tokenFromUrl]);

  const isTotalZero =
    proposalBillingDetails &&
    proposalBillingDetails.totalbilled === 0 &&
    proposalBillingDetails.invoices.length === 0;
  const isDetailsLoaded =
    proposalBillingDetails && !loading && !loadingSubContractors;

  const anyError = subContractorsError || error;
  return (
    <>
      <TopBanner>
        <PageDetails
          title={`Proposal Billing Details: ${
            isDetailsLoaded ? proposalBillingDetails.title : ""
          }`}
          subtitle={isDetailsLoaded ? proposalBillingDetails.token : ""}
          actionsContent={null}
        />
      </TopBanner>
      <Main fillScreen>
        <GoBackLink />
        {anyError ? (
          <Message kind="error">{anyError.toString()}</Message>
        ) : !isDetailsLoaded ? (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        ) : isTotalZero ? (
          <Card paddingSize="small">
            There are no billings for this proposal yet
          </Card>
        ) : (
          <Card paddingSize="small" className={styles.tableWrapper}>
            <Table
              className={styles.table}
              data={getDetailsData(
                proposalBillingDetails.invoices,
                subContractors
              )}
              headers={TABLE_HEADERS}
            />
            <H3 className={styles.totalText}>
              Total: {formatCentsToUSD(proposalBillingDetails.totalbilled)}
            </H3>
          </Card>
        )}
      </Main>
    </>
  );
};

export default withRouter(ProposalBillingDetails);
