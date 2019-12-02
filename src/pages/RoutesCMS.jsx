import React, { useEffect } from "react";
import { Switch, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLoaderContext } from "src/containers/Loader";
import {
  Route,
  AuthenticatedRoute,
  AdminAuthenticatedRoute
} from "src/containers/Routes";
import PageNotFound from "./NotFound";
import commonRoutes from "./commonRoutes";

import PageListUserInvoices from "./Invoices/UserList";
import PageInvoicesNew from "./Invoices/New";
import PageInvoiceDetail from "./Invoices/Detail";
import PageListAdminInvoices from "./Invoices/AdminList";

const Redirect = withRouter(({ to, history, location }) => {
  useEffect(() => {
    if (location.pathname !== to) {
      history.push(to);
    }
  }, [history, location.pathname, to]);
  return null;
});

const Routes = ({ location }) => {
  const { currentUser } = useLoaderContext();
  const loggedIn = !!currentUser;
  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={300}>
        <Switch location={location}>
          <Route exact path="/">
            {loggedIn ? (
              currentUser.isadmin ? (
                <Redirect to="/invoices/admin" />
              ) : (
                <Redirect to="/invoices/me" />
              )
            ) : (
              <Redirect to="/user/login" />
            )}
          </Route>
          {commonRoutes}

          {/* Record routes */}
          <AuthenticatedRoute
            path="/invoices/me"
            title="My Invoices"
            exact
            component={PageListUserInvoices}
          />
          <AuthenticatedRoute
            path="/invoices/new"
            title="New Invoice"
            exact
            component={PageInvoicesNew}
          />
          <AdminAuthenticatedRoute
            path="/invoices/admin"
            title="Admin"
            exact
            component={PageListAdminInvoices}
          />
          <AuthenticatedRoute
            path="/invoices/:token"
            title="Invoice Detail"
            exact
            component={PageInvoiceDetail}
          />

          {/* <AdminAuthenticatedRoute
            path={`/${recordType}s/unvetted`}
            title={`Unvetted ${capitalize(recordType)}s`}
            exact
            component={PageProposalsUnvetted}
          />
          <AuthenticatedRoute
            path={`/${recordType}s/new`}
            title={`New ${capitalize(recordType)}`}
            exact
            render={renderNewRecordRoute(config)}
          />
          <Route
            path={`/${recordType}s/:token`}
            title={`${capitalize(recordType)} Detail`}
            titleSelector={sel.proposalName}
            exact
            component={PageProposalDetail}
          />
          <Route
            path={`/${recordType}s/:token/comments/:commentid`}
            title={`${capitalize(recordType)} Detail`}
            titleSelector={sel.proposalName}
            exact
            component={PageProposalDetail}
          />
          <AuthenticatedRoute
            path={`/${recordType}s/:token/edit`}
            title={`Edit ${capitalize(recordType)}`}
            exact
            render={renderEditRecordRoute(config)}
          />
          <AuthenticatedRoute
            path={`/${recordType}s/new`}
            title={`New ${capitalize(recordType)}`}
            exact
            render={renderNewRecordRoute(config)}
          />
          <AdminAuthenticatedRoute
            path={`/${recordType}s/admin`}
            title={`Admin ${capitalize(recordType)}s`}
            exact
            component={PageProposalsAdmin}
          /> */}
          <Route title="Page Not Found" path="*" component={PageNotFound} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(Routes);
