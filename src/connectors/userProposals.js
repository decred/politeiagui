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
    draftProposals: sel.getDraftProposals,
    error: sel.userProposalsError,
    isLoading: sel.userProposalsIsRequesting,
    header: () => "Your Proposals",
    emptyProposalsMessage: () => "You have not created any proposals yet"
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchUserProposals,
      },
      dispatch
    )
);

class Wrapper extends Component {
  constructor(props) {
    super();
    this.state = { filter: props.match.params && props.match.params.filter || "active" };
  }

  componentDidMount() {
    const { userid, loggedInAsEmail, onFetchData, history } = this.props;
    if (!loggedInAsEmail) history.push("/login");
    if (userid !== null) onFetchData(userid);
  }

  render() {
    const Component = this.props.Component;
    const {loggedInAsEmail, isAdmin, draftProposals, proposals, error, isLoading, header, emptyProposalsMessage} = this.props;
    return (
      <div className="page content user-proposals-page">
        <div className="user-proposals-filter">
          <span> Show: </span>
          <div
            onClick={() => this.setState({ filter: "active" })}
            className={`user-proposal-option ${this.state.filter === "active" && "selected"}`}>
            Active
          </div>
          <div
            onClick={() => this.setState({ filter: "draft" })}
            className={`user-proposal-option ${this.state.filter === "draft" && "selected"}`}>
            Draft
          </div>
        </div>
        <Component
          loggedInAsEmail={loggedInAsEmail}
          isAdmin={isAdmin}
          proposals={this.state.filter === "active" ? proposals : draftProposals}
          error={error}
          isLoading={isLoading}
          header={header}
          emptyProposalsMessage={emptyProposalsMessage}
        />
      </div>
    );
  }
}

const wrap = Component =>
  userProposalsConnector(props => <Wrapper {...{ ...props, Component }} />);

export default wrap;
