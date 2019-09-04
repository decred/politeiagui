import { Link, useMediaQuery } from "pi-ui";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import ModalChangeUsername from "src/componentsv2/ModalChangeUsername";
import Proposals from "src/containers/Proposal/User/Submitted";
import useQueryStringWithIndexValue from "src/hooks/utils/useQueryStringWithIndexValue";
import Credits from "./Credits";
import styles from "./detail.module.css";
import General from "./General";
import { tabValues } from "./helpers";
import { useChangeUsername, useUserDetail } from "./hooks";
import Identity from "./Identity";
import Preferences from "./Preferences";

const getTabComponent = ({ user, ...rest }) =>
  [
    <Identity {...user} {...rest} />,
    <General {...user} {...rest} />,
    <Preferences {...rest} />,
    <Credits {...rest} />,
    <Proposals userID={user.id} />
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

  const isUserPageOwner = user && loggedInAsUserId === user.id;
  const isAdminOrTheUser = user && (isAdmin || loggedInAsUserId === user.id);

  const tabLabels = [
    tabValues.IDENTITY,
    tabValues.GENERAL,
    tabValues.PREFERENCES,
    tabValues.CREDITS,
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

  const isTabDisabled = tabIndex => {
    const tabLabel = tabLabels[tabIndex];
    if (tabLabel === tabValues.PREFERENCES && !isUserPageOwner) return true;

    if (tabLabel === tabValues.CREDITS && !isAdminOrTheUser) return true;

    return false;
  };

  const isMobileScreen = useMediaQuery("(max-width:560px)");
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
          <Tabs onSelectTab={onSetIndex} activeTabIndex={index} mode={isMobileScreen ? "dropdown" : "horizontal"}>
            {tabLabels.map((label, i) => {
              return isTabDisabled(i) ? (
                <></>
              ) : (
                  <Tab key={`tab${label}`} label={label} />
                );
            })}
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
            isAdmin
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
