import React from "react";
import { Switch, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  Route,
  AdminAuthenticatedRoute,
  AuthenticatedRoute
} from "src/containers/Routes";
import commonRoutes from "./commonRoutes";
import PageNotFound from "./NotFound";
import PageProposalVettedDetail from "./Proposals/DetailVetted";
import PageProposalUnvettedDetail from "./Proposals/DetailUnvetted";
import PageProposalsVettedList from "./Proposals/VettedList";
import PageProposalsAdmin from "./Proposals/AdminList";
import PageProposalNew from "./Proposals/New";
import PageVettedProposalEdit from "./Proposals/EditVetted";
import PageUnvettedProposalEdit from "./Proposals/EditUnvetted";

import useOnboardModal from "src/hooks/utils/useOnboardModal";
import PageUserDetail from "./User/Detail";
import { LIST_HEADER_ADMIN, LIST_HEADER_VETTED } from "src/constants";

const Routes = ({ location }) => {
  useOnboardModal();
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Switch location={location}>
          <Route
            path="/"
            title={LIST_HEADER_VETTED}
            exact
            component={PageProposalsVettedList}
          />
          {commonRoutes}
          {/* User Route */}
          <Route
            path="/user/:userid"
            title="User Detail"
            exact
            key="user-detail-route"
            component={PageUserDetail}
          />
          {/* Record routes */}
          <AdminAuthenticatedRoute
            path={"/records/admin"}
            title={LIST_HEADER_ADMIN}
            exact
            component={PageProposalsAdmin}
          />
          <AuthenticatedRoute
            path={"/records/new"}
            title={"New Proposal"}
            exact
            render={PageProposalNew}
          />
          <Route
            path={"/records/vetted/:token"}
            title={"Proposal Detail"}
            exact
            component={PageProposalVettedDetail}
          />
          <Route
            path={"/records/unvetted/:token"}
            title={"Proposal Detail"}
            exact
            component={PageProposalUnvettedDetail}
          />
          <Route
            path={"/records/vetted/:token/comments/:commentid"}
            title={"Proposal Detail"}
            exact
            component={PageProposalVettedDetail}
          />
          <Route
            path={"/records/unvetted/:token/comments/:commentid"}
            title={"Proposal Detail"}
            exact
            component={PageProposalUnvettedDetail}
          />
          <AuthenticatedRoute
            path={"/records/vetted/:token/edit"}
            title={"Edit Proposal"}
            exact
            render={PageVettedProposalEdit}
          />
          <AuthenticatedRoute
            path={"/records/unvetted/:token/edit"}
            title={"Edit Proposal"}
            exact
            render={PageUnvettedProposalEdit}
          />
          <Route title="Page Not Found" path="*" component={PageNotFound} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(Routes);
