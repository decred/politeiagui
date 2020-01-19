import React from "react";
import PropTypes from "prop-types";

const PayoutRow = ({
  token,
  description,
  domain,
  expenses,
  labor,
  proposaltoken,
  subdomain,
  month,
  year,
  paiddate,
  amountreceived
}) => {
  return (
    <tr>
      <td>{month}</td>
      <td>{year}</td>
      <td>{token}</td>
      <td>{domain}</td>
      <td>{subdomain}</td>
      <td>{description}</td>
      <td>{proposaltoken}</td>
      <td>{expenses}</td>
      <td>{labor}</td>
      <td>{expenses + labor}</td>
      <td>{paiddate}</td>
      <td>{amountreceived}</td>
    </tr>
  );
};

const PayoutsTable = ({ lineItemPayouts }) => {
  return (
    <table className="payouts-table">
      <tbody>
        <tr>
          <th>Month</th>
          <th>Year</th>
          <th>Invoice Token</th>
          <th>Domain</th>
          <th>Sub Domain</th>
          <th>Description</th>
          <th>Proposal Token</th>
          <th>Expenses (USD)</th>
          <th>Labor (USD)</th>
          <th>Total (USD)</th>
          <th>Paid Date</th>
          <th>Amount Received</th>
        </tr>
        {lineItemPayouts.map((payout, idx) => (
          <PayoutRow key={`payout-${idx}`} {...payout} />
        ))}
      </tbody>
    </table>
  );
};

PayoutsTable.propTypes = {
  lineItemPayouts: PropTypes.array.isRequired
};

export default PayoutsTable;
