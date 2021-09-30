import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import { getProposalsTokensFromInvoice } from "../helpers";
import isEmpty from "lodash/fp/isEmpty";
import isEqual from "lodash/fp/isEqual";
import values from "lodash/fp/values";
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";

export function useInvoice(invoiceToken) {
  const invoiceSelector = useMemo(
    () => sel.makeGetInvoiceByToken(invoiceToken),
    [invoiceToken]
  );
  const invoice = useSelector(invoiceSelector);
  const currentUser = useSelector(sel.currentUser);
  const proposalsByToken = useSelector(sel.proposalsByToken);
  const onFetchInvoice = useAction(act.onFetchInvoice);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);

  const unfetchedProposalsTokens = difference(
    getProposalsTokensFromInvoice(invoice)
  )(keys(proposalsByToken));

  const hasUnfetchedProposalsTokens = !isEmpty(unfetchedProposalsTokens);

  const initialValues = {
    status: "idle",
    loading: true
  };

  const [state, send, { FETCH, VERIFY, REJECT, RESOLVE, RETRY }] =
    useFetchMachine({
      actions: {
        initial: () => {
          if (!invoice || (invoice && !invoice.payout)) {
            onFetchInvoice(invoiceToken)
              .then(() => send(VERIFY))
              .catch((e) => send(REJECT, e));
            return send(FETCH);
          }
          return send(VERIFY);
        },
        load: () => {
          if (!invoice || hasUnfetchedProposalsTokens) {
            return;
          }
          return send(VERIFY);
        },
        verify: function verifyRemainingProposalsTokens() {
          if (invoice && hasUnfetchedProposalsTokens) {
            onFetchProposalsBatch({
              tokens: unfetchedProposalsTokens,
              fetchVoteSummary: false,
              fetchProposalSummary: false
            })
              .then(() => send(VERIFY))
              .catch((e) => send(REJECT, e));
          }
          return send(RESOLVE, {
            invoice,
            proposals: values(proposalsByToken)
          });
        },
        done: () => {
          if (!isEqual(state.invoice, invoice)) {
            return send(RETRY, initialValues);
          }
        }
      },
      initialValues
    });

  return {
    invoice: state.invoice,
    loading: state.loading || state.verifying,
    proposals: state.proposals,
    proposalsError: state.error,
    currentUser
  };
}

export function useInvoices(currentInvoice, userid, start, end) {
  const invoices = useSelector(sel.allInvoices);
  const filteredInvoices =
    invoices && invoices.length > 0
      ? invoices.filter((inv) => {
          const invTimestamp =
            new Date(inv.input.year, inv.input.month).getTime() / 1000;
          return (
            inv.censorshiprecord.token !== currentInvoice &&
            inv.userid === userid &&
            invTimestamp >= start &&
            invTimestamp <= end
          );
        })
      : null;
  return {
    invoices: filteredInvoices
  };
}

export function useFetchCodeStats(id, start, end) {
  const onFetchUserCodeStats = useAction(act.onFetchUserCodeStats);

  const [loading, error] = useAPIAction(onFetchUserCodeStats, [id, start, end]);

  return { loading, error };
}

export function useCodeStats(id, start, end) {
  const codeStatsSelector = useMemo(
    () => sel.makeGetCodeStatsByUserID(id, start, end),
    [id, start, end]
  );
  const codestats = useSelector(codeStatsSelector);

  return { codestats };
}
