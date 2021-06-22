import { useState, useEffect, useCallback } from "react";
import * as act from "src/actions";
import fileDownload from "js-file-download";
import { useAction } from "src/redux";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import {
  handleSaveVotesTimetamps,
  loadVotesTimestamps
} from "src/lib/local_storage";

const TIMESTAMPS_PAGE_SIZE = 100;
export function useDownloadVoteTimestamps(token, votesCount) {
  const [votes, setVotes] = useState(null);
  const [auths, setAuths] = useState(null);
  const [details, setDetails] = useState(null);
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const multiPage = votesCount > TIMESTAMPS_PAGE_SIZE;
  const onFetchTicketVoteTimestamps = useAction(
    act.onFetchTicketVoteTimestamps
  );

  const getProgressPercentage = useCallback(
    (total) =>
      total ? ((total * TIMESTAMPS_PAGE_SIZE) / votesCount).toFixed(2) : 0,
    [votesCount]
  );

  useEffect(() => {
    setProgress(getProgressPercentage(votes?.length));
  }, [getProgressPercentage, votes]);

  const [state, send, { START, VERIFY, FETCH, RESOLVE, REJECT }] =
    useFetchMachine({
      actions: {
        initial: () => {
          const ts = loadVotesTimestamps(token);
          const hasProofs = ts?.votes?.reduce(
            (acc, v) => acc && v.proofs.length > 0,
            true
          );
          if (ts?.votes?.length === votesCount && hasProofs) {
            return send(RESOLVE, ts);
          }
          if (token && !votes) {
            return send(START);
          }
          return;
        },
        start: () => {
          // fetch unpaginated data from vote timestamps
          onFetchTicketVoteTimestamps(token)
            .then((resp) => {
              setAuths([...resp.auths]);
              setDetails({ ...resp.details });
              // fetch first page of vote timestamps
              onFetchTicketVoteTimestamps(token, page)
                .then((resp) => {
                  setVotes([...resp.votes]);
                  setPage(page + 1);
                  return send(VERIFY);
                })
                .catch((e) => send(REJECT, e));
            })
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        },
        verify: () => {
          if (votes?.length === votesCount) {
            // all timestamps loaded, resolve
            handleSaveVotesTimetamps(token, { auths, details, votes });
            fileDownload(
              JSON.stringify({ auths, details, votes }, null, 2),
              `${token}-votes-timestamps.json`
            );
            return send(RESOLVE, { auths, details, votes });
          } else {
            // more timestamps remaining, fetch next page
            onFetchTicketVoteTimestamps(token, page)
              .then((resp) => {
                setVotes([...votes, ...resp.votes]);
                setPage(page + 1);
                return send(VERIFY);
              })
              .catch((e) => {
                send(REJECT, e);
              });
            return send(FETCH);
          }
        }
      },
      initialValues: {
        status: "idle",
        loading: false,
        auths: null,
        details: null,
        votes: null,
        progress: 0
      }
    });

  return {
    loading: state.loading || state.verifying,
    error: state.error,
    progress: progress,
    timestamps: {
      auths: state.auths,
      details: state.details,
      votes: state.votes
    },
    multiPage: multiPage
  };
}
