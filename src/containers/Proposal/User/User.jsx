import React, { useMemo, useState, useEffect, useRef } from "react";
import { tabValues } from "./helpers";
import useNavigation from "src/hooks/api/useNavigation";
import useQueryStringWithIndexValue from "src/hooks/utils/useQueryStringWithIndexValue";
import Drafts from "./Drafts";
import Submitted from "./Submitted";
import { useMediaQuery } from "pi-ui";

function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
}

const ProposalsUser = ({
  TopBanner,
  PageDetails,
  Sidebar,
  Main,
  Tabs,
  Tab
}) => {
  const tabLabels = [tabValues.DRAFTS, tabValues.SUBMITTED];
  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);
  const tabOption = tabLabels[index];

  const { user } = useNavigation();
  const userId = user.userid;
  // Proposals fetching will be triggered from the 'proposals' tab
  // but cached here to avoid re-fetching it
  const [userProposals, setUserProposals] = useState(null);
  const isMobileScreen = useMediaQuery("(max-width:560px)");

  useTraceUpdate({ userProposals, userId });

  const content = useMemo(() => {
    const mapTabToContent = {
      [tabValues.DRAFTS]: <Drafts />,
      [tabValues.SUBMITTED]: (
        <Submitted
          userID={userId}
          userProposals={userProposals}
          setUserProposals={setUserProposals}
        />
      )
    };
    return mapTabToContent[tabOption];
  }, [tabOption, userProposals, userId]);

  return (
    <>
      <TopBanner>
        <PageDetails title="Your Proposals">
          <Tabs onSelectTab={onSetIndex} activeTabIndex={index}>
            {tabLabels.map(label => (
              <Tab key={`tab-${label}`} label={label} />
            ))}
          </Tabs>
        </PageDetails>
      </TopBanner>
      <Sidebar />
      <Main>{content}</Main>
    </>
  );
};

export default ProposalsUser;
