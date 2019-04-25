import React from "react";
import PropTypes from "prop-types";

const PayoutRow = ({
  year,
  month,
  contractorname,
  contractorrate,
  labortotal,
  expensetotal,
  address
}) => {
  return (
    <tr>
      <td>{year}</td>
      <td>{month}</td>
      <td>{contractorname}</td>
      <td>{contractorrate}</td>
      <td>{labortotal}</td>
      <td>{expensetotal}</td>
      <td>{expensetotal + labortotal}</td>
      <td>{address}</td>
    </tr>
  );
};

const PayoutsTable = ({ payouts }) => {
  return (
    <table className="payouts-table">
      <tbody>
        <tr>
          <th>Year</th>
          <th>Month</th>
          <th>Name</th>
          <th>Rate (USD)</th>
          <th>Labor total (USD)</th>
          <th>Expense total (USD)</th>
          <th>Combined total (USD)</th>
          <th>Address</th>
        </tr>
        {payouts.map((payout, idx) => (
          <PayoutRow key={`payout-${idx}`} {...payout} />
        ))}
      </tbody>
    </table>
  );
};

PayoutsTable.propTypes = {
  payouts: PropTypes.array.isRequired
};

export default PayoutsTable;
