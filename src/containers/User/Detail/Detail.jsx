import { Button, classNames, Link } from "pi-ui";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import ModalChangeUsername from "src/componentsv2/ModalChangeUsername";
import useMediaQuery from "src/hooks/useMediaQuery";
import { useQueryStringWithIndexValue } from "src/lib/queryString";
import styles from "./detail.module.css";
import General from "./General.jsx";
import { useChangeUsername, useUserDetail } from "./hooks";
import Preferences from "./Preferences.jsx";
import Proposals from "./Proposals.jsx";

const getTabComponent = ({ user, ...rest }) => [
  <General {...user} {...rest} />,
  <Preferences {...rest} />,
  <Proposals {...rest} />
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
  history,
  match
}) => {
  const { onFetchUser, validateUUID, user, isAdmin, loggedInAsUserId } = useUserDetail();

  const isUserPageOwner = user && (loggedInAsUserId === user.id);
  const isAdminOrTheUser = user && (isAdmin || loggedInAsUserId === user.id);

  const tabLabels = ["General", "Preferences", "Proposals"];
  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);

  // Change Username Modal
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const openUsernameModal = (e) => {
    e.preventDefault();
    setShowUsernameModal(true);
  };
  const closeUsernameModal = () => setShowUsernameModal(false);
  const { username, onChangeUsername, validationSchema } = useChangeUsername();

  // Validate and set user id or throw an error in case it is invalid
  useEffect(function setUserID() {
    const userId = match && match.params && match.params.userid;
    if (!validateUUID(userId)) {
      throw new Error("Invalid user ID");
    } else {
      onFetchUser(userId);
    }
  }, []);

  // Media Query
  const matchesMediaQueryExtraSmall = useMediaQuery("(max-width: 560px)");

  // TODO: need a loading while user has not been fetched yet
  return user ? (
    <>
      <TopBanner>
        <PageDetails>
          <div className={styles.titleWrapper}>
            <Title>{username || user.username}</Title>
            {
              isUserPageOwner &&
              <Link href="#" onClick={openUsernameModal} className={classNames(styles.titleLink)}>Change Username</Link>
            }
          </div>
          <Subtitle>{user.email}</Subtitle>
          <Tabs onSelectTab={onSetIndex} activeTabIndex={index}>
            {tabLabels.map(label => (
              <Tab key={`tab${label}`} label={label} />
            ))}
          </Tabs>
        </PageDetails>
        <SideBanner className={styles.sidebanner}>
          {matchesMediaQueryExtraSmall ?
            <Button
              size="sm"
              icon
              onClick={() => history.push("/proposals/new")}
            >
              +
            </Button>
            :
            <Button
              onClick={() => history.push("/proposals/new")}
            >
              New Proposal
            </Button>
          }
        </SideBanner>
      </TopBanner>
      <Sidebar />
      <Main className="main">
        {getTabComponent({ user, isAdminOrTheUser, isUserPageOwner, isAdmin })[index]}
      </Main>
      <ModalChangeUsername validationSchema={validationSchema} onChangeUsername={onChangeUsername} show={showUsernameModal} onClose={closeUsernameModal} />
    </>
  ) : null;
};

export default withRouter(UserDetail);
