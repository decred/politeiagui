import { useState, useCallback, useEffect } from "react";
import { COMPARE, BASE } from "./const";
import * as act from "src/actions";
import { useAction } from "../../redux";
import { getAttachmentsFiles, parseRawProposal } from "../../helpers";

export function useCompareVersionSelector(initVersion, latestVersion, token) {
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
    async (onFetchProposalDetailsWithoutState, token, version) => {
      if (!version) {
        // return empty data for case version = 0
        return {
          details: {},
          files: [],
          text: "",
          title: ""
        };
      }
      // Fetch provided version
      const proposal = await onFetchProposalDetailsWithoutState(token, version);
      // Parse current version
      const { description, name } = parseRawProposal(proposal);
      return {
        details: proposal,
        files: getAttachmentsFiles(proposal.files),
        text: description,
        title: name
      };
    },
    []
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
    fetchProposalVersions(
      onFetchProposalDetailsWithoutState,
      token,
      baseVersion
    )
      .then((proposal) => {
        setBaseLoading(false);
        setBaseProposal(proposal);
      })
      .catch((e) => {
        setError(e);
        setBaseLoading(false);
      });
  }, [
    token,
    baseVersion,
    fetchProposalVersions,
    onFetchProposalDetailsWithoutState
  ]);
  useEffect(() => {
    setCompareLoading(true);
    setError(null);
    fetchProposalVersions(
      onFetchProposalDetailsWithoutState,
      token,
      compareVersion
    )
      .then((proposal) => {
        setCompareLoading(false);
        setCompareProposal(proposal);
      })
      .catch((e) => {
        setError(e);
        setCompareLoading(false);
      });
  }, [
    token,
    compareVersion,
    fetchProposalVersions,
    onFetchProposalDetailsWithoutState
  ]);
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
