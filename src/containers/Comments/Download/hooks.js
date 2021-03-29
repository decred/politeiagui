import { createContext, useContext, useMemo, useState, useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import useTimestamps from "src/hooks/api/useTimestamps";
import take from "lodash/fp/take";
import takeRight from "lodash/fp/takeRight";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import fileDownload from "js-file-download";
import { useLoader } from "src/containers/Loader";
import {
  handleSaveCommentsTimetamps,
  loadCommentsTimestamps
} from "src/lib/local_storage";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export function useDownloadComments(token) {
  const commentsSelector = useMemo(() => sel.makeGetRecordComments(token), [
    token
  ]);
  const comments = useSelector(commentsSelector);
  const { onFetchCommentsTimestamps } = useTimestamps();

  return { comments, onFetchCommentsTimestamps };
}

const TIMESTAMPS_PAGE_SIZE = 100;
export function useDownloadCommentsTimestamps(recordToken) {
  const { apiInfo } = useLoader();
  const [timestamps, setTimestamps] = useState(null);
  const [remaining, setRemaining] = useState([]);
  const [progress, setProgress] = useState(0);
  const commentsSelector = useMemo(
    () => sel.makeGetRecordComments(recordToken),
    [recordToken]
  );
  const comments = useSelector(commentsSelector);
  const commentsLength = comments.length || 0;
  const onFetchCommentsTimestamps = useAction(act.onFetchCommentsTimestamps);

  useEffect(() => {
    const ids = comments && comments.map((c) => c.commentid);
    setRemaining(ids);
  }, [comments]);

  const getCommentIdsForPagination = (commentIds) => [
    take(TIMESTAMPS_PAGE_SIZE)(commentIds),
    takeRight(commentIds.length - TIMESTAMPS_PAGE_SIZE)(commentIds)
  ];

  const getProgressPercentage = (timestamps) =>
    (Object.keys(timestamps.length * 100) / commentsLength).toFixed(2);

  const makeTimestampsBundle = (timestamps) =>
    JSON.stringify(
      {
        comments: timestamps.comments,
        serverpublickey: apiInfo.pubkey
      },
      null,
      2
    );

  const [
    state,
    send,
    { START, VERIFY, FETCH, RESOLVE, REJECT }
  ] = useFetchMachine({
    actions: {
      initial: () => {
        const ts = loadCommentsTimestamps(recordToken);
        const loaded = ts && Object.keys(ts.comments).length === commentsLength;
        if (loaded) {
          return send(RESOLVE, { timestamps: ts });
        }
        if (recordToken && !timestamps) {
          return send(START);
        }
        return;
      },
      start: () => {
        // fetch first page of comments timestamps
        const [fetch, next] = getCommentIdsForPagination(remaining);
        onFetchCommentsTimestamps(recordToken, fetch)
          .then(({ comments }) => {
            setTimestamps({ comments });
            setProgress(getProgressPercentage(comments));
            setRemaining(next);
            return send(VERIFY);
          })
          .catch((e) => send(REJECT, e));
        return send(FETCH);
      },
      verify: () => {
        if (remaining.length === 0) {
          // all timestamps loaded, resolve
          handleSaveCommentsTimetamps(recordToken, timestamps);
          setProgress(100);
          fileDownload(
            makeTimestampsBundle(timestamps),
            `${recordToken}-comments-timestamps.json`
          );
          return send(RESOLVE, { timestamps });
        } else {
          // fetch remaining timestamps
          const [fetch, next] = getCommentIdsForPagination(remaining);
          onFetchCommentsTimestamps(recordToken, fetch)
            .then((resp) => {
              setTimestamps({
                comments: {
                  ...timestamps.comments,
                  ...resp.comments
                }
              });
              setProgress(getProgressPercentage(comments));
              setRemaining(next);
              return send(VERIFY);
            })
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
      }
    },
    initialValues: {
      status: "idle",
      loading: false,
      timestamps: null,
      progress: 0
    }
  });

  return {
    loading: state.loading || state.verifying,
    error: state.error,
    progress: progress,
    timestamps: {
      comments: state.timestamps?.comments,
      serverpublickey: apiInfo.pubkey
    }
  };
}
