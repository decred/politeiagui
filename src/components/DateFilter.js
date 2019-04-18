import React from "react";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import {
  setQueryStringValue,
  getQueryStringValue,
  removeQueryStringsFromUrl
} from "../lib/queryString";
import {
  MONTHS,
  YEARS,
  FILTER_ALL_MONTHS,
  CMS_DEFAULT_TAB_TITLE
} from "../constants";
import { getCurrentYear } from "../helpers";

const invoiceFilterMonthOptions = MONTHS.reduce(
  (arr, m, idx) => [...arr, { label: m, value: idx + 1 }],
  []
);
const invoiceFilterYearOptions = YEARS.reduce(
  (arr, y) => [...arr, { label: y, value: parseInt(y, 10) }],
  []
);

class DateFilter extends React.Component {
  componentDidMount() {
    const { yearFilterValue, monthFilterValue } = this.props;
    const qsMonth = getQueryStringValue("month");
    const qsYear = getQueryStringValue("year");
    if (qsMonth) {
      this.props.handleChangeDateFilter(qsMonth, yearFilterValue);
    } else if (qsYear) {
      this.props.handleChangeDateFilter(monthFilterValue, qsYear);
    } else if (qsMonth && qsYear) {
      this.props.handleChangeDateFilter(qsMonth, qsYear);
    } else if (!qsMonth && !qsYear) {
      this.props.handleResetDateFilter && this.props.handleResetDateFilter();
    }
  }

  onSetMonthSortOption = option => {
    const { yearFilterValue } = this.props;
    setQueryStringValue("month", option.value);

    this.props.handleChangeDateFilter(option.value, yearFilterValue);
  };

  onSetYearSortOption = option => {
    const { monthFilterValue } = this.props;
    setQueryStringValue("year", option.value);

    this.props.handleChangeDateFilter(monthFilterValue, option.value);
  };

  onResetSortOptions = () => {
    this.props.handleChangeDateFilter(FILTER_ALL_MONTHS, getCurrentYear());
    removeQueryStringsFromUrl(window.location.href, "year", "month");
  };

  render() {
    const { header, monthFilterValue, yearFilterValue } = this.props;
    const selectedYear = invoiceFilterYearOptions.find(
      op => op.value === yearFilterValue
    );
    const selectedMonth =
      invoiceFilterMonthOptions.find(op => op.value === monthFilterValue) ||
      monthFilterValue === FILTER_ALL_MONTHS;

    return header && header !== CMS_DEFAULT_TAB_TITLE ? (
      <div className="dropdown-sort-wrapper">
        <Select
          classNamePrefix="sort-select"
          value={selectedMonth}
          onChange={this.onSetMonthSortOption}
          options={invoiceFilterMonthOptions.map(op => op)}
          components={{
            ClearIndicator: null
          }}
        />
        <Select
          classNamePrefix="sort-select"
          value={selectedYear}
          onChange={this.onSetYearSortOption}
          options={invoiceFilterYearOptions.map(op => op)}
          components={{
            ClearIndicator: null
          }}
        />
        <span onClick={this.onResetSortOptions}>Reset</span>
      </div>
    ) : null;
  }
}

export default withRouter(DateFilter);
