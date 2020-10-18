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
import PageVettedProposalDetail from "./Proposals/VettedDetail";
import PageUnvettedProposalDetail from "./Proposals/UnvettedDetail";
import PageProposalsPublicList from "./Proposals/PublicList";
import PageProposalsAdmin from "./Proposals/AdminList";
import PageProposalNew from "./Proposals/New";
import PageProposalEdit from "./Proposals/Edit";
import useOnboardModal from "src/hooks/utils/useOnboardModal";
import PageUserDetail from "./User/Detail";
import { LIST_HEADER_ADMIN, LIST_HEADER_PUBLIC } from "src/constants";

const Routes = ({ location }) => {
  useOnboardModal();
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Switch location={location}>
          <Route
            path="/"
            title={LIST_HEADER_PUBLIC}
            exact
            component={PageProposalsPublicList}
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
            path={"/proposals/admin"}
            title={LIST_HEADER_ADMIN}
            exact
            component={PageProposalsAdmin}
          />
          <AuthenticatedRoute
            path={"/proposals/new"}
            title={"New Proposal"}
            exact
            render={PageProposalNew}
          />
          <Route
            path={"/proposals/vetted/:token"}
            title={"Proposal Detail"}
            exact
            component={PageVettedProposalDetail}
          />
          <Route
            path={"/proposals/unvetted/:token"}
            title={"Proposal Detail"}
            exact
            component={PageUnvettedProposalDetail}
          />
          <Route
            path={"/proposals/vetted/:token/comments/:commentid"}
            title={"Proposal Detail"}
            exact
            component={PageVettedProposalDetail}
          />
          {/* XXX test comments urls for unvetted */}
          <Route
            path={"/proposals/unvetted/:token/comments/:commentid"}
            title={"Proposal Detail"}
            exact
            component={PageUnvettedProposalDetail}
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
