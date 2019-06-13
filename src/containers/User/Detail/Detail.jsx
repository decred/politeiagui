import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useUserDetail } from "./hooks";
import { useQueryStringWithIndexValue } from "src/lib/queryString";
import { Link } from "pi-ui";
import styles from "./detail.module.css";
import General from "./General.jsx";
import Preferences from "./Preferences.jsx";
import Proposals from "./Proposals.jsx";
import ModalChangeUsername from "src/componentsv2/ModalChangeUsername";
import { useChangeUsername } from "./hooks";

const getTabComponent = (params) => [
  <General {...params} />,
  <Preferences {...params} />,
  <Proposals {...params} />
];

const UserDetail = ({
  TopBanner,
  PageDetails,
  SideBanner,
  Sidebar,
  Main,
  Title,
  Subtitle,
  Tabs,
  Tab,
  match
}) => {
  const { onFetchUser, validateUUID, user } = useUserDetail();

  const tabLabels = ["General", "Preferences", "Proposals"];
  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);

  // Change Username Modal
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const openUsernameModal = () => setShowUsernameModal(true);
  const closeUsernameModal = () => setShowUsernameModal(false);
  const { loggedInAsUsername, onChangeUsername, validationSchema } = useChangeUsername();

  // Validate and set user id or throw an error in case it is invalid
  useEffect(function setUserID() {
    const userId = match && match.params && match.params.userid;
    if (!validateUUID(userId)) {
      throw new Error("Invalid user ID");
    } else {
      onFetchUser(userId);
    }
  }, []);

  // TODO: need a loading while user has not been fetched yet
  return user ? (
    <>
      <TopBanner>
        <PageDetails>
          <div className={styles.titleWrapper}>
            <Title>{loggedInAsUsername}</Title>
            <Link href="#" onClick={openUsernameModal} className={styles.titleLink}>Change Username</Link>
          </div>
          <Subtitle>{user.email}</Subtitle>
          <Tabs onSelectTab={onSetIndex} activeTabIndex={index}>
            {tabLabels.map(label => (
              <Tab key={`tab${label}`} label={label} />
            ))}
          </Tabs>
        </PageDetails>
        <SideBanner />
      </TopBanner>
      <Sidebar />
      <Main className="main">
        {getTabComponent(user)[index]}
      </Main>
      <ModalChangeUsername validationSchema={validationSchema} onChangeUsername={onChangeUsername} show={showUsernameModal} onClose={closeUsernameModal} />
    </>
  ) : null;
};

export default withRouter(UserDetail);
