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
import PageProposalsUnvetted from "./Proposals/UnvettedList";
import PageProposalNew from "./Proposals/New";
import PageProposalEdit from "./Proposals/Edit";
import useOnboardModal from "src/hooks/utils/useOnboardModal";

const Routes = ({ location }) => {
  useOnboardModal();
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
