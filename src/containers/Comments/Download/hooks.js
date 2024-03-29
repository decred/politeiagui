import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback
} from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import useTimestamps from "src/hooks/api/useTimestamps";
import take from "lodash/fp/take";
import takeRight from "lodash/fp/takeRight";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import fileDownload from "js-file-download";
import {
  handleSaveCommentsTimetamps,
  loadCommentsTimestamps
} from "src/lib/local_storage";

export const CommentContext = createContext();
export const useComment = () => useContext(CommentContext);

export function useDownloadComments(token) {
  const commentsSelector = useMemo(
    () => sel.makeGetRecordComments(token),
    [token]
  );
  const allCommentsBySection = useSelector(commentsSelector);
  const comments =
    allCommentsBySection && Object.values(allCommentsBySection).flat();
  const { onFetchCommentsTimestamps } = useTimestamps();

  return { comments, onFetchCommentsTimestamps };
}

export function useDownloadCommentsTimestamps(recordToken, timestampsPageSize) {
  const [timestamps, setTimestamps] = useState(null);
  const [remaining, setRemaining] = useState([]);
  const [progress, setProgress] = useState(0);
  const commentsSelector = useMemo(
    () => sel.makeGetRecordComments(recordToken),
    [recordToken]
  );
  const allCommentsBySection = useSelector(commentsSelector);
  const comments = useMemo(
    () => Object.values(allCommentsBySection).flat(),
    [allCommentsBySection]
  );
  const commentsLength = comments?.length || 0;
  const multiPage = commentsLength > timestampsPageSize;
  const onFetchCommentsTimestamps = useAction(act.onFetchCommentsTimestamps);

  useEffect(() => {
    const ids = comments && comments.map((c) => c.commentid);
    setRemaining(ids);
  }, [comments]);

  const getCommentIdsForPagination = (commentIds) => [
    take(timestampsPageSize)(commentIds),
    takeRight(commentIds.length - timestampsPageSize)(commentIds)
  ];

  const getProgressPercentage = useCallback(
    (timestamps) =>
      timestamps
        ? ((Object.keys(timestamps).length * 100) / commentsLength).toFixed(0)
        : 0,
    [commentsLength]
  );

  const makeTimestampsBundle = (timestamps) =>
    JSON.stringify(
      {
        comments: timestamps.comments
      },
      null,
      2
    );

  useEffect(() => {
    setProgress(getProgressPercentage(timestamps?.comments));
  }, [getProgressPercentage, timestamps]);

  const [state, send, { START, VERIFY, FETCH, RESOLVE, REJECT }] =
    useFetchMachine({
      actions: {
        initial: () => {
          const ts = loadCommentsTimestamps(recordToken);
          const loaded =
            ts && Object.keys(ts.comments).length === commentsLength;
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
          const [fetch, next] = getCommentIdsForPagination(remaining || []);
          onFetchCommentsTimestamps(recordToken, fetch)
            .then(({ comments }) => {
              setTimestamps({ comments });
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
      comments: state.timestamps?.comments
    },
    multiPage: multiPage
  };
}
