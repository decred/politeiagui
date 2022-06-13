import React, { useState } from "react";
import {
  Card,
  Table,
  Text,
  Spinner,
  H3,
  Link as PiLink,
  classNames
} from "pi-ui";
import Link from "src/components/Link";
import ExportToCsv from "src/components/ExportToCsv";
import { useProposalsOwnedBilling } from "./hooks";
import styles from "./ProposalsOwned.module.css";
import { usdFormatter } from "src/utils";
import { MONTHS_LABELS } from "src/constants";
import groupBy from "lodash/fp/groupBy";

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

const totalReducer = (acc, { lineitem: { expenses, labor }, contractorrate }) =>
  acc + expenses / 100 + ((labor / 60) * contractorrate) / 100;

const formatData = ({
  userid,
  month,
  year,
  username,
  lineitem: { description, domain, subdomain, labor, expenses },
  contractorrate
}) => {
  expenses = expenses / 100;
  labor = ((labor / 60) * contractorrate) / 100;
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
};

const MonthItems = ({ monthItems }) => {
  const data = monthItems.map(formatData);
  const total = monthItems.reduce(totalReducer, 0);
  return (
    <>
      <Table headers={headers} data={data} linesPerPage={50} />
      <H3 className={styles.totalText}>Total: {usdFormatter.format(total)}</H3>
    </>
  );
};

const YearItems = ({ year, yearItems }) => {
  const groupedByMonth = groupBy((el) => el.month, yearItems);
  const months = Object.keys(groupedByMonth);
  return months.reverse().map((month) => (
    <>
      <H3>
        {MONTHS_LABELS[month - 1]} {year}
      </H3>
      <MonthItems monthItems={groupedByMonth[month]} />
    </>
  ));
};

const AllItems = ({ groupedByYearItems }) => {
  const years = Object.keys(groupedByYearItems);
  return years
    .reverse()
    .map((year) => (
      <YearItems year={year} yearItems={groupedByYearItems[year]} />
    ));
};

const BillingInfo = ({ lineItems }) => {
  if (lineItems.length === 0)
    return <H3 className="margin-top-m">No billings for this proposal yet</H3>;
  const groupedByYear = groupBy((el) => el.year, lineItems);
  const data = lineItems.map(formatData);
  const total = lineItems.reduce(totalReducer, 0);
  return (
    <div className="margin-top-m">
      <AllItems groupedByYearItems={groupedByYear} />
      <ExportToCsv
        data={data.map(
          ({
            Username,
            Date,
            Domain,
            Subdomain,
            Description,
            Labor,
            Expenses,
            Total
          }) => ({
            Username: Username.props.children,
            Date,
            Domain,
            Subdomain,
            Description,
            Labor,
            Expenses,
            Total
          })
        )}
        fields={[
          "Username",
          "Date",
          "Domain",
          "Subdomain",
          "Description",
          "Labor",
          "Expenses",
          "Total"
        ]}
        filename="proposal_details.csv"
      >
        <PiLink className="cursor-pointer">Export All To Csv</PiLink>
      </ExportToCsv>
      <H3 className={classNames(styles.totalText, "margin-top-l")}>
        Total for this proposal: {usdFormatter.format(total)}
      </H3>
    </div>
  );
};

const ProposalTitle = ({ title, onClick }) => (
  <Text
    weight="bold"
    size="large"
    onClick={onClick}
    className={styles.proposalTitle}
  >
    {title}
  </Text>
);

const ProposalBilling = ({ token, title }) => {
  const { billingInfo, getProposalBillingInfo } =
    useProposalsOwnedBilling(token);
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
