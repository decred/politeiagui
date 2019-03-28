import React from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { Tabs, Tab } from "./Tabs";
import {
  PROPOSAL_FILTER_ALL,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_USER_FILTER_SUBMITTED,
  PROPOSAL_USER_FILTER_DRAFT,
  PROPOSAL_VOTING_ACTIVE,
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_REJECTED,
  PROPOSAL_APPROVED,
  LIST_HEADER_PUBLIC,
  LIST_HEADER_UNVETTED,
  LIST_HEADER_USER,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  PROPOSAL_VOTING_AUTHORIZED,
  PROPOSAL_STATUS_ABANDONED
} from "../constants";
import { setQueryStringValue } from "../lib/queryString";

const adminFilterOptions = [
  {
    label: "unreviewed",
    value: PROPOSAL_STATUS_UNREVIEWED
  },
  {
    label: "censored",
    value: PROPOSAL_STATUS_CENSORED
  },
  {
    label: "all proposals",
    value: PROPOSAL_FILTER_ALL
  }
];
const publicFilterOptions = [
  {
    label: "all proposals",
    value: PROPOSAL_FILTER_ALL
  },
  {
    label: "pre-voting",
    value: PROPOSAL_VOTING_NOT_AUTHORIZED
  },
  {
    label: "active voting",
    value: PROPOSAL_VOTING_ACTIVE
  },
  {
    label: "approved",
    value: PROPOSAL_APPROVED
  },
  {
    label: "rejected",
    value: PROPOSAL_REJECTED
  },
  {
    label: "abandoned",
    value: PROPOSAL_STATUS_ABANDONED
  }
];
const userFilterOptions = [
  {
    label: "submitted",
    value: PROPOSAL_USER_FILTER_SUBMITTED
  },
  {
    label: "drafts",
    value: PROPOSAL_USER_FILTER_DRAFT
  }
];
const mapHeaderToOptions = {
  [LIST_HEADER_UNVETTED]: adminFilterOptions,
  [LIST_HEADER_PUBLIC]: publicFilterOptions,
  [LIST_HEADER_USER]: userFilterOptions
};

const mapHeaderToCount = {
  [LIST_HEADER_UNVETTED]: (proposalCounts, status) => {
    // unreviewed proposals and proposals with unreviewed changes are shown on the same list
    // so is necessary to sum their counts
    const count = proposalCounts[status] || 0;
    if (status === PROPOSAL_STATUS_UNREVIEWED) {
      return count + (proposalCounts[PROPOSAL_STATUS_UNREVIEWED_CHANGES] || 0);
    }
    return count;
  },
  [LIST_HEADER_PUBLIC]: (proposalCounts, status) => {
    // voting not authorized and voting authorized proposals are shown on the same list
    // so is necessary to sum their counts

    const count = proposalCounts[status] || 0;
    if (status === PROPOSAL_VOTING_NOT_AUTHORIZED) {
      return count + (proposalCounts[PROPOSAL_VOTING_AUTHORIZED] || 0);
    }
    return count;
  },
  [LIST_HEADER_USER]: (proposalCounts, status) => proposalCounts[status] || 0
};

class ProposalFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdateFilterValueForQueryValue(props);
  }
  componentDidUpdate(prevProps) {
    this.handleUpdateQueryForFilterValueChange(prevProps);
  }
  handleUpdateFilterValueForQueryValue = props => {
    const { location, header, handleChangeFilterValue } = props;
    const { tab } = qs.parse(location.search);
    const tabOptions = mapHeaderToOptions[header];
    if (!tabOptions) return;

    const validTabOption = tabOptions.find(op => op.label === tab);
    if (validTabOption) {
      handleChangeFilterValue(validTabOption.value);
    }
  };
  handleUpdateQueryForFilterValueChange = prevProps => {
    const { header } = this.props;
    const filterValueTabHasChanged =
      prevProps.filterValue !== this.props.filterValue;
    const tabOptions = mapHeaderToOptions[header];
    if (!tabOptions) return;

    const selectedOption =
      tabOptions && tabOptions.find(op => op.value === this.props.filterValue);
    const optionLabel = selectedOption.label;

    if (filterValueTabHasChanged) {
      setQueryStringValue("tab", optionLabel);
    }
  };
  render() {
    const {
      handleChangeFilterValue,
      header,
      filterValue,
      proposalCounts
    } = this.props;
    return mapHeaderToOptions[header] ? (
      <Tabs>
        {mapHeaderToOptions[header].map(op => (
          <Tab
            key={op.value}
            title={op.label}
            count={mapHeaderToCount[header](proposalCounts, op.value)}
            selected={filterValue === op.value}
            onTabChange={() => handleChangeFilterValue(op.value)}
          />
        ))}
      </Tabs>
    ) : null;
  }
}

export default withRouter(ProposalFilter);
