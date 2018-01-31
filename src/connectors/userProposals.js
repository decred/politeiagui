import React, {Component} from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const userProposalsConnector = connect(
  sel.selectorMap({
    userid: sel.userid,
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
    proposals: sel.userProposals,
    error: sel.userProposalsError,
    isLoading: sel.userProposalsIsRequesting,
    header: () => "Your Proposals"
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchUserProposals
      },
      dispatch
    )
);

class Wrapper extends Component {
  componentWillReceiveProps(nextProps) {
    const { userid, onFetchData } = this.props;
    try {
      if (nextProps.userid !== userid) onFetchData(nextProps.userid);
    } catch (e) {
      throw e;
    }

  }
  componentDidUpdate(prevProps) {
    const { userid, onFetchData } = this.props;
    try {
      if (prevProps.userid !== userid) onFetchData(userid);
    }
    catch(e) {
      throw(e);
    }
  }

  render() {
    const Component = this.props.Component;
    const {loggedInAs, isAdmin, proposals, error, isLoading, header} = this.props;
    return <Component
      loggedInAs={loggedInAs}
      isAdmin={isAdmin}
      proposals={proposals}
      error={error}
      isLoading={isLoading}
      header={header}
    />;
  }
}

const wrap = Component =>
  userProposalsConnector(props => <Wrapper {...{ ...props, Component }} />);

export default wrap;
