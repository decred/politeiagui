import React, { useState } from "react";
import { Card, Table, Text, Spinner, H3 } from "pi-ui";
import Link from "src/components/Link";
import { useProposalsOwnedBilling } from "./hooks";
import styles from "./ProposalsOwned.module.css";
import { usdFormatter } from "src/utils";

const headers = [
  "Username",
  "Date",
  "Domain",
  "Subdomain",
  "Description",
  "Labor",
  "Expenses",
  "Sub Total"
];

const BillingInfo = ({ lineItems }) => {
  let total = 0;
  if (lineItems.length === 0)
    return <H3 className="margin-top-m">No billings for this proposal yet</H3>;
  const data = lineItems.map(
    ({
      userid,
      month,
      year,
      username,
      lineitem: { description, domain, subdomain, labor, expenses },
      contractorrate
    }) => {
      expenses = expenses / 100;
      labor = labor / 60 * contractorrate / 100;
      total = total + expenses + labor;
      return {
        Username: <Link to={`/user/${userid}`}>{username}</Link>,
        Date: `${month}/${year}`,
        Domain: domain,
        Subdomain: subdomain,
        Description: description,
        Labor: usdFormatter.format(labor),
        Expenses: usdFormatter.format(expenses),
        Total: usdFormatter.format(labor + expenses)
      };
    }
  );
  return (
    <div className="margin-top-m">
      <Table headers={headers} data={data} />
      <H3 className={styles.totalText}>Total: {usdFormatter.format(total)}</H3>
    </div>
  );
};

const ProposalTitle = ({ title, onClick }) => (
  <Text
    weight="bold"
    size="large"
    onClick={onClick}
    className={styles.proposalTitle}>
    {title}
  </Text>
);

const ProposalBilling = ({ token, title }) => {
  const { billingInfo, getProposalBillingInfo } = useProposalsOwnedBilling(
    token
  );
  const [showInfo, setShowInfo] = useState(false);
  const handleProposalClick = () => {
    if (!billingInfo) getProposalBillingInfo(token);
    setShowInfo(!showInfo);
  };
  const showBillingInfo = showInfo && billingInfo;
  const showLoading = showInfo && !billingInfo;
  return (
    <Card paddingSize="small" className="margin-bottom-m">
      <ProposalTitle title={title} onClick={handleProposalClick} />
      {showBillingInfo && <BillingInfo lineItems={billingInfo.lineitems} />}
      {showLoading && (
        <div className="margin-top-m">
          <Spinner invert />
        </div>
      )}
    </Card>
  );
};

export default ProposalBilling;
