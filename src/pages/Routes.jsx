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
import PageProposalDetail from "./Proposals/Detail";
import PageProposalsVettedList from "./Proposals/VettedList";
import PageProposalsAdmin from "./Proposals/AdminList";
import PageProposalNew from "./Proposals/New";
import PageProposalEdit from "./Proposals/Edit";
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
            path="/admin/records"
            title={LIST_HEADER_ADMIN}
            exact
            component={PageProposalsAdmin}
          />
          <AuthenticatedRoute
            path="/record/new"
            title="New Proposal"
            exact
            render={PageProposalNew}
          />
          <Route
            path="/record/:token"
            title="Proposal Detail"
            exact
            component={PageProposalDetail}
          />
          <Route
            path="/record/:token/comments/:commentid"
            title="Proposal Detail"
            exact
            component={PageProposalDetail}
          />
          <AuthenticatedRoute
            path="/record/:token/edit"
            title="Edit Proposal"
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
