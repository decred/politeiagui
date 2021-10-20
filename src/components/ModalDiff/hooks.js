import { useState, useMemo } from "react";
import { COMPARE, BASE } from "./constants";
import * as act from "src/actions";
import { useAction } from "src/redux";
import drop from "lodash/drop";
import { getAttachmentsFiles, parseRawProposal } from "src/helpers";
import useFetchMachine, {
  FETCH,
  REJECT,
  RESOLVE,
  START
} from "src/hooks/utils/useFetchMachine";

const parseProposal = (proposal) => {
  if (!proposal) {
    // Return empty data for case: proposal = undefined.
    return {
      details: {},
      files: [],
      text: "",
      title: ""
    };
  }
  // Parse current version.
  const { description, name } = parseRawProposal(proposal);
  return {
    details: proposal,
    files: getAttachmentsFiles(proposal.files),
    text: description,
    title: name
  };
};

export function useCompareVersionSelector(initVersion, token) {
  const [versionsQueue, setVersionsQueue] = useState([
    initVersion,
    initVersion - 1
  ]);
  const [fetchedProposals, setFetchedProposals] = useState({});
  const [baseVersion, setBaseVersion] = useState(initVersion - 1);
  const [compareVersion, setCompareVersion] = useState(initVersion);
  const baseProposal = useMemo(() => {
    const proposal = fetchedProposals[baseVersion];
    return parseProposal(proposal);
  }, [baseVersion, fetchedProposals]);
  const compareProposal = useMemo(() => {
    const proposal = fetchedProposals[compareVersion];
    return parseProposal(proposal);
  }, [compareVersion, fetchedProposals]);
  const onFetchProposalDetailsWithoutState = useAction(
    act.onFetchProposalDetailsWithoutState
  );

  const [state, send] = useFetchMachine({
    actions: {
      initial: () => {
        if (versionsQueue.length) {
          return send(START);
        }
        return send(RESOLVE);
      },
      start: () => {
        if (!versionsQueue.length) {
          return send(RESOLVE);
        }
        const version = versionsQueue[0];
        if (version <= 0) {
          setVersionsQueue(drop(versionsQueue));
          return send(START);
        }
        onFetchProposalDetailsWithoutState(token, version)
          .then((proposal) => {
            setFetchedProposals({
              ...fetchedProposals,
              [version]: proposal
            });
            setVersionsQueue(drop(versionsQueue));
            if (setVersionsQueue.length) {
              return send(START);
            }
            return send(RESOLVE);
          })
          .catch((e) => send(REJECT, e));

        return send(FETCH);
      },
      done: () => {}
    },
    initialValues: {
      status: "idle",
      loading: true,
      verifying: true
    }
  });

  const changedVersion = (versionType, v) => {
    if (versionType === COMPARE) {
      setCompareVersion(v);
    }
    if (versionType === BASE) {
      setBaseVersion(v);
    }
    if (!fetchedProposals[v]) {
      setVersionsQueue([v, ...versionsQueue]);
      send(START);
    }
  };
  const fetchingNotDone = state.loading || state.status !== "success";

  return {
    baseVersion,
    compareVersion,
    changedVersion,
    baseProposal,
    compareProposal,
    loading: fetchingNotDone
  };
}
