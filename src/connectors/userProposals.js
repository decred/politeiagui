import React, {Component} from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const userProposalsConnector = connect(
  sel.selectorMap({
    userid: sel.userid,
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    proposals: sel.userProposals,
    error: sel.userProposalsError,
    isLoading: sel.userProposalsIsRequesting,
    activeVotes: sel.activeVotes,
    header: () => "Your Proposals",
    emptyProposalsMessage: () => "You have not created any proposals yet"
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchUserProposals,
        onFetchActiveVotes: act.onFetchActiveVotes
      },
      dispatch
    )
);

class Wrapper extends Component {
  componentDidMount() {
    const { userid, loggedInAsEmail, onFetchData, history } = this.props;
    if (!loggedInAsEmail) history.push("/login");
    if (userid !== null) onFetchData(userid);
  }

  render() {
    const Component = this.props.Component;
    const {loggedInAsEmail, isAdmin, proposals, error, isLoading, header, emptyProposalsMessage} = this.props;
    return <Component
      loggedInAsEmail={loggedInAsEmail}
      isAdmin={isAdmin}
      proposals={proposals}
      error={error}
      isLoading={isLoading}
      header={header}
      emptyProposalsMessage={emptyProposalsMessage}
    />;
  }
}

const wrap = Component =>
  userProposalsConnector(props => <Wrapper {...{ ...props, Component }} />);

export default wrap;
