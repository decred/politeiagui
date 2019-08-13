import React from "react";
import PropTypes from "prop-types";

const usdConvert = 100;
const dcrConvert = 100000000;

const PayoutRow = ({
  year,
  month,
  contractorname,
  contractorrate,
  labortotal,
  expensetotal,
  address,
  exchangerate,
  dcrtotal,
  approvedtime
}) => {
  return (
    <tr>
      <td>{new Date(approvedtime * 1000).toString()}</td>
      <td>{year}</td>
      <td>{month}</td>
      <td>{contractorname}</td>
      <td>{contractorrate / usdConvert}</td>
      <td>{labortotal / usdConvert}</td>
      <td>{expensetotal / usdConvert}</td>
      <td>{(expensetotal + labortotal) / usdConvert}</td>
      <td>{exchangerate / usdConvert}</td>
      <td>{dcrtotal / dcrConvert}</td>
      <td>{address}</td>
    </tr>
  );
};

const PayoutsTable = ({ payouts }) => {
  return (
    <table className="payouts-table">
      <tbody>
        <tr>
          <th>Approved Time</th>
          <th>Year</th>
          <th>Month</th>
          <th>Name</th>
          <th>Rate (USD)</th>
          <th>Labor total (USD)</th>
          <th>Expense total (USD)</th>
          <th>Combined total (USD)</th>
          <th>Exchange Rate (USD)</th>
          <th>Total Payment (DCR)</th>
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
