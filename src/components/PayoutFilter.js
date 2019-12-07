import React from "react";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { MONTHS, YEARS, FILTER_ALL_MONTHS } from "../constants";

const invoiceFilterMonthOptions = MONTHS.reduce(
  (arr, m, idx) => [...arr, { label: m, value: idx + 1 }],
  []
);
const invoiceFilterYearOptions = YEARS.reduce(
  (arr, y) => [...arr, { label: y, value: parseInt(y, 10) }],
  []
);

class PayoutFilter extends React.Component {
  componentDidMount() {
    this.props.handleResetDateFilter && this.props.handleResetDateFilter();
  }

  onSetMonthSortOption = (option) => {
    const { yearFilterValue } = this.props;
    this.props.handleChangeDateFilter(option.value, yearFilterValue);
  };

  onSetYearSortOption = (option) => {
    const { monthFilterValue } = this.props;
    this.props.handleChangeDateFilter(monthFilterValue, option.value);
  };

  render() {
    const { header, monthFilterValue, yearFilterValue } = this.props;
    const selectedYear = invoiceFilterYearOptions.find(
      (op) => op.value === yearFilterValue
    );
    const selectedMonth =
      invoiceFilterMonthOptions.find((op) => op.value === monthFilterValue) ||
      monthFilterValue === FILTER_ALL_MONTHS;

    return (
      <div className="dropdown-sort-wrapper">
        <h1>{header}</h1>
        <Select
          classNamePrefix="sort-select"
          value={selectedMonth}
          onChange={this.onSetMonthSortOption}
          options={invoiceFilterMonthOptions.map((op) => op)}
          components={{
            ClearIndicator: null
          }}
        />
        <Select
          classNamePrefix="sort-select"
          value={selectedYear}
          onChange={this.onSetYearSortOption}
          options={invoiceFilterYearOptions.map((op) => op)}
          components={{
            ClearIndicator: null
          }}
        />
      </div>
    );
  }
}

export default withRouter(PayoutFilter);
