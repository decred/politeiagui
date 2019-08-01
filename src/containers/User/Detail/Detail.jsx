import React, { useEffect, useState, useCallback } from "react";
import { Link } from "pi-ui";
import { withRouter } from "react-router-dom";
import ModalChangeUsername from "src/componentsv2/ModalChangeUsername";
import useQueryStringWithIndexValue from "src/hooks/useQueryStringWithIndexValue";
import styles from "./detail.module.css";
import General from "./General.jsx";
import { useChangeUsername, useUserDetail } from "./hooks";
import { tabValues } from "./helpers";
import Preferences from "./Preferences.jsx";
import Proposals from "./Proposals";

const getTabComponent = ({
  user,
  userProposals,
  setUserProposals,
  ...rest
}) => [
  <General {...user} {...rest} />,
  <Preferences {...rest} />,
  <Proposals
    userID={user.id}
    userProposals={userProposals}
    setUserProposals={setUserProposals}
  />
];

const UserDetail = ({
  TopBanner,
  PageDetails,
  Sidebar,
  Main,
  Title,
  Tabs,
  Tab,
  match
}) => {
  const {
    onFetchUser,
    onResetUser,
    validateUUID,
    user,
    isAdmin,
    userId,
    loggedInAsUserId
  } = useUserDetail({ match });

  if (!validateUUID(userId)) throw new Error("Invalid user ID");

  // Proposals fetching will be triggered from the 'proposals' tab
  // but cached here to avoid re-fetching it
  const [userProposals, setUserProposals] = useState(null);

  const isUserPageOwner = user && loggedInAsUserId === user.id;
  const isAdminOrTheUser = user && (isAdmin || loggedInAsUserId === user.id);

  const tabLabels = [
    tabValues.GENERAL,
    tabValues.PREFERENCES,
    tabValues.PROPOSALS
  ];
  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);

  // Change Username Modal
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const openUsernameModal = e => {
    e.preventDefault();
    setShowUsernameModal(true);
  };
  const closeUsernameModal = () => setShowUsernameModal(false);
  const { username, onChangeUsername, validationSchema } = useChangeUsername();

  // Validate and set user id or throw an error in case it is invalid
  useEffect(
    function setUserID() {
      if (!!user) {
        return;
      }
      onFetchUser(userId);
    },
    [userId, onFetchUser, user]
  );

  useEffect(() => {
    return () => onResetUser();
  }, [onResetUser]);

  const handleCacheUserProposals = useCallback(proposals => {
    setUserProposals(proposals);
  }, []);

  // TODO: need a loading while user has not been fetched yet
  return user ? (
    <>
      <TopBanner>
        <PageDetails
          title={
            <div className={styles.titleWrapper}>
              <Title>{username || user.username}</Title>
              {isUserPageOwner && (
                <Link
                  href="#"
                  onClick={openUsernameModal}
                  className={styles.titleLink}
                >
                  Change Username
                </Link>
              )}
            </div>
          }
          subtitle={user.email}
        >
          <Tabs onSelectTab={onSetIndex} activeTabIndex={index}>
            {tabLabels.map(label => (
              <Tab key={`tab${label}`} label={label} />
            ))}
          </Tabs>
        </PageDetails>
      </TopBanner>
      <Sidebar />
      <Main className="main">
        {
          getTabComponent({
            user,
            isAdminOrTheUser,
            isUserPageOwner,
            isAdmin,
            userProposals,
            setUserProposals: handleCacheUserProposals
          })[index]
        }
      </Main>
      <ModalChangeUsername
        validationSchema={validationSchema}
        onChangeUsername={onChangeUsername}
        show={showUsernameModal}
        onClose={closeUsernameModal}
      />
    </>
  ) : null;
};

export default withRouter(UserDetail);
