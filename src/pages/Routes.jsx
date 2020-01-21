import React from "react";
import { Switch, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import * as sel from "src/selectors";
import {
  Route,
  AdminAuthenticatedRoute,
  AuthenticatedRoute
} from "src/containers/Routes";
import commonRoutes from "./commonRoutes";
import PageNotFound from "./NotFound";
import PageProposalDetail from "./Proposals/Detail";
import PageProposalsPublicList from "./Proposals/PublicList";
import PageProposalsUnvetted from "./Proposals/UnvettedList";
import PageProposalNew from "./Proposals/New";
import PageProposalEdit from "./Proposals/Edit";

const Routes = ({ location }) => {
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Switch location={location}>
          <Route
            path="/"
            title="Public Proposals"
            exact
            component={PageProposalsPublicList}
          />
          {commonRoutes}
          {/* Record routes */}
          <AdminAuthenticatedRoute
            path={"/proposals/unvetted"}
            title={"Unvetted Proposals"}
            exact
            component={PageProposalsUnvetted}
          />
          <AuthenticatedRoute
            path={"/proposals/new"}
            title={"New Proposal"}
            exact
            render={PageProposalNew}
          />
          <Route
            path={"/proposals/:token"}
            title={"Proposal Detail"}
            titleSelector={sel.proposalName}
            exact
            component={PageProposalDetail}
          />
          <Route
            path={"/proposals/:token/comments/:commentid"}
            title={"Proposal Detail"}
            titleSelector={sel.proposalName}
            exact
            component={PageProposalDetail}
          />
          <AuthenticatedRoute
            path={"/proposals/:token/edit"}
            title={"Edit Proposal"}
            exact
            render={PageProposalEdit}
          />
          <Route title="Page Not Found" path="*" component={PageNotFound} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(Routes);
