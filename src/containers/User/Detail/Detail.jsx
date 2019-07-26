import { Link } from "pi-ui";
import React, { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import ModalChangeUsername from "src/componentsv2/ModalChangeUsername";
import useQueryStringWithIndexValue from "src/hooks/useQueryStringWithIndexValue";
import Credits from "./Credits";
import styles from "./detail.module.css";
import General from "./General.jsx";
import { tabValues } from "./helpers";
import { useChangeUsername, useUserDetail } from "./hooks";
import Preferences from "./Preferences.jsx";
import Proposals from "./Proposals";

const getTabComponent = ({
  user,
  userProposals,
  setUserProposals,
  isAdminOrTheUser,
  ...rest
}) =>
  [
    <General {...user} {...rest} />,
    <Preferences {...rest} />,
    isAdminOrTheUser && <Credits {...rest} />,
    <Proposals
      userID={user.id}
      userProposals={userProposals}
      setUserProposals={setUserProposals}
    />
  ].filter(Boolean);

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
  const { user, isAdmin, userId, loggedInAsUserId } = useUserDetail({ match });

  // Proposals fetching will be triggered from the 'proposals' tab
  // but cached here to avoid re-fetching it
  const [userProposals, setUserProposals] = useState(null);

  const [tabLabels, setTabLabels] = useState([]);

  const isUserPageOwner = user && loggedInAsUserId === user.id;
  const isAdminOrTheUser = user && (isAdmin || loggedInAsUserId === user.id);

  useEffect(() => {
    setTabLabels(
      [
        tabValues.GENERAL,
        tabValues.PREFERENCES,
        isAdminOrTheUser ? tabValues.CREDITS : false,
        tabValues.PROPOSALS
      ].filter(Boolean)
    );
  }, [isAdminOrTheUser]);

  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);
  // console.log(index);
  // Change Username Modal
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const openUsernameModal = e => {
    e.preventDefault();
    setShowUsernameModal(true);
  };
  const closeUsernameModal = () => setShowUsernameModal(false);
  const { username, onChangeUsername, validationSchema } = useChangeUsername();

  const handleCacheUserProposals = useCallback(proposals => {
    setUserProposals(proposals);
  }, []);

  // TODO: need a loading while user has not been fetched yet
  return !!user && userId === user.id ? (
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
