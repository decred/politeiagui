import React, { Component } from "react";
import { autobind } from "core-decorators";
import UserDetailPage from "./Page";
import userConnector from "../../connectors/user";
import {
  USER_DETAIL_TAB_GENERAL,
  USER_DETAIL_TAB_PREFERENCES,
  USER_DETAIL_TAB_PROPOSALS,
  USER_DETAIL_TAB_COMMENTS
} from "../../constants";
import { setQueryStringWithoutPageReload } from "../../helpers";
import qs from "query-string";

const userDetailOptions = [
  {
    label: "general",
    value: USER_DETAIL_TAB_GENERAL
  },
  {
    label: "preferences",
    value: USER_DETAIL_TAB_PREFERENCES
  },
  {
    label: "proposals",
    value: USER_DETAIL_TAB_PROPOSALS
  },
  {
    label: "comments",
    value: USER_DETAIL_TAB_COMMENTS
  }
];

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabId: this.handleUpdateFilterValueForQueryValue(props)
    };
  }

  componentDidUpdate(_, prevState) {
    this.handleUpdateQueryForFilterValueChange(prevState);
  }

  handleUpdateFilterValueForQueryValue = props => {
    const { location } = props;
    const { tab } = qs.parse(location.search);
    const validTabOption = userDetailOptions.find(op => op.label === tab);
    return validTabOption ? validTabOption.value : USER_DETAIL_TAB_GENERAL;
  };
  handleUpdateQueryForFilterValueChange = prevState => {
    const filterValueTabHasChanged = prevState.tabId !== this.state.tabId;
    const selectedOption = userDetailOptions.find(
      op => op.value === this.state.tabId
    );
    filterValueTabHasChanged &&
      setQueryStringWithoutPageReload(`?tab=${selectedOption.label}`);
  };

  componentDidMount() {
    this.props.onFetchData(this.props.userId);
    this.props.onFetchUserProposals(this.props.userId);
    this.props.onFetchProposalsVoteStatus();
  }

  onTabChange(tabId) {
    this.setState({ tabId: tabId });
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  render() {
    const { isTestnet } = this.props;
    const dcrdataTxUrl = isTestnet
      ? "https://testnet.dcrdata.org/tx/"
      : "https://explorer.dcrdata.org/tx/";

    return (
      <UserDetailPage
        {...{
          ...this.props,
          dcrdataTxUrl,
          tabId: this.state.tabId,
          onTabChange: this.onTabChange
        }}
      />
    );
  }
}

autobind(UserDetail);

export default userConnector(UserDetail);
