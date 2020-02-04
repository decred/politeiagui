import React, { useEffect } from "react";
import { Switch, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLoaderContext } from "src/containers/Loader";
import { DccProvider } from "src/containers/DCC";
import {
  Route,
  AuthenticatedRoute,
  AdminAuthenticatedRoute
} from "src/containers/Routes";
import PageNotFound from "./NotFound";
import commonRoutes from "./commonRoutes";

import PageListUserInvoices from "./Invoices/UserList";
import PageInvoicesNew from "./Invoices/New";
import PageInvoiceEdit from "./Invoices/Edit";
import PageInvoiceDetail from "./Invoices/Detail";
import PageListAdminInvoices from "./Invoices/AdminList";
import PageGeneratePayoutsList from "./Invoices/Payouts";
import PageInvoicePayouts from "./Invoices/InvoicePayouts";
import PageDccDetail from "./DCCs/Detail";
import PageDccList from "./DCCs/List";

const Redirect = withRouter(({ to, history, location }) => {
  useEffect(() => {
    if (location.pathname !== to) {
      history.push({ pathname: to, search: location.search });
    }
  }, [history, location.pathname, to, location.search]);
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
                <Redirect to="/admin/invoices" />
              ) : (
                <Redirect to="/invoices/me" />
              )
            ) : (
              <Redirect to="/user/login" />
            )}
          </Route>
          <Route exact path="/register">
            <Redirect to="/user/signup" />
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
          <AuthenticatedRoute
            path="/invoices/:token"
            title="Invoice Detail"
            exact
            component={PageInvoiceDetail}
          />
          <AuthenticatedRoute
            path="/invoices/:token/edit"
            title="Edit Invoice"
            exact
            component={PageInvoiceEdit}
          />
          {/* Admin routes */}
          <AdminAuthenticatedRoute
            path="/admin/invoices"
            title="Admin"
            exact
            component={PageListAdminInvoices}
          />
          <AdminAuthenticatedRoute
            path="/admin/payouts"
            title="Payouts"
            exact
            component={PageGeneratePayoutsList}
          />
          <AdminAuthenticatedRoute
            path="/admin/invoicepayouts"
            title="Line Item Payouts"
            exact
            component={PageInvoicePayouts}
          />
          <DccProvider>
            <AuthenticatedRoute
              path="/dccs"
              title="DCCs"
              exact
              component={PageDccList}
            />
            <AuthenticatedRoute
              path="/dccs/:token"
              title="DCC Detail"
              exact
              component={PageDccDetail}
            />
          </DccProvider>
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
