import { useState, useCallback, useEffect } from "react";
import { COMPARE, BASE } from "./constants";
import * as act from "src/actions";
import { useAction } from "src/redux";
import { getAttachmentsFiles, parseRawProposal } from "src/helpers";

export function useCompareVersionSelector(initVersion, token) {
  const [baseVersion, setBaseVersion] = useState(initVersion - 1);
  const [compareVersion, setCompareVersion] = useState(initVersion);
  const [baseLoading, setBaseLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareProposal, setCompareProposal] = useState({});
  const [baseProposal, setBaseProposal] = useState({});
  const [error, setError] = useState();

  const onFetchProposalDetailsWithoutState = useAction(
    act.onFetchProposalDetailsWithoutState
  );

  const fetchProposalVersions = useCallback(
    async (token, version) => {
      if (!version) {
        // Return empty data for case: version = 0.
        return {
          details: {},
          files: [],
          text: "",
          title: ""
        };
      }
      // Fetch provided version.
      const proposal = await onFetchProposalDetailsWithoutState(token, version);
      // Parse current version.
      const { description, name } = parseRawProposal(proposal);
      return {
        details: proposal,
        files: getAttachmentsFiles(proposal.files),
        text: description,
        title: name
      };
    },
    [onFetchProposalDetailsWithoutState]
  );

  const changedVersion = (versionType, v) => {
    if (versionType === COMPARE) {
      setCompareVersion(v);
    }
    if (versionType === BASE) {
      setBaseVersion(v);
    }
  };

  useEffect(() => {
    setBaseLoading(true);
    setError(null);
    fetchProposalVersions(token, baseVersion)
      .then((proposal) => {
        setBaseLoading(false);
        setBaseProposal(proposal);
      })
      .catch((e) => {
        setError(e);
        setBaseLoading(false);
      });
  }, [token, baseVersion, fetchProposalVersions]);

  useEffect(() => {
    setCompareLoading(true);
    setError(null);
    fetchProposalVersions(token, compareVersion)
      .then((proposal) => {
        setCompareLoading(false);
        setCompareProposal(proposal);
      })
      .catch((e) => {
        setError(e);
        setCompareLoading(false);
      });
  }, [token, compareVersion, fetchProposalVersions]);

  return {
    baseVersion,
    compareVersion,
    baseLoading,
    compareLoading,
    changedVersion,
    baseProposal,
    compareProposal,
    error
  };
}
