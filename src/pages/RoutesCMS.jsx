import React, { useEffect } from "react";
import { Switch, withRouter } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useLoaderContext } from "src/containers/Loader";
import { withDcc } from "src/containers/DCC";
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
import PageDccNew from "./DCCs/New";

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
            path="/invoices/:token/comments/:commentid"
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
          <AuthenticatedRoute
            path="/dccs"
            title="DCCs"
            exact
            component={withDcc(PageDccList)}
          />
          <AuthenticatedRoute
            path="/dccs/new"
            title="New DCC"
            exact
            component={withDcc(PageDccNew)}
          />
          <AuthenticatedRoute
            path="/dccs/:token"
            title="DCC Detail"
            exact
            component={withDcc(PageDccDetail)}
          />
          <AuthenticatedRoute
            path="/dccs/:token/comments/:commentid"
            title="DCC Detail"
            exact
            component={withDcc(PageDccDetail)}
          />
          <Route title="Page Not Found" path="*" component={PageNotFound} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(Routes);
