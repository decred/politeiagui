import { Link, useMediaQuery } from "pi-ui";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withRouter } from "react-router-dom";
import ModalChangeUsername from "src/componentsv2/ModalChangeUsername";
import { PUB_KEY_STATUS_LOADED, PUB_KEY_STATUS_LOADING } from "src/constants";
import UserProposals from "src/containers/Proposal/User";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import useQueryStringWithIndexValue from "src/hooks/utils/useQueryStringWithIndexValue";
import { existing, myPubKeyHex } from "src/lib/pki";
import Account from "./Account";
import Credits from "./Credits";
import styles from "./Detail.module.css";
import { tabValues } from "./helpers";
import useChangeUsername from "./hooks/useChangeUsername";
import useUserDetail from "./hooks/useUserDetail";
import Identity from "./Identity";
import Preferences from "./Preferences";

const getTabComponents = ({ user, ...rest }) => {
  const mapTabValueToComponent = {
    [tabValues.IDENTITY]: <Identity key="tab-identity" user={user} {...rest} />,
    [tabValues.ACCOUNT]: <Account key="tab-account" {...user} {...rest} />,
    [tabValues.PREFERENCES]: (
      <Preferences user={user} key="tab-preferences" {...rest} />
    ),
    [tabValues.CREDITS]: <Credits key="tab-credits" user={user} {...rest} />,
    [tabValues.PROPOSALS]: (
      <UserProposals
        key="tab-proposals"
        userID={user.userid}
        withDrafts={rest.isUserPageOwner}
      />
    )
  };
  return mapTabValueToComponent;
};

const UserDetail = ({
  TopBanner,
  PageDetails,
  Main,
  Title,
  Tabs,
  Tab,
  match
}) => {
  const userID = match.params.userid;
  const { user, isAdmin, currentUserID } = useUserDetail(userID);
  const {
    userPubkey,
    currentUserEmail,
    identityImportSuccess
  } = useUserIdentity();

  const isUserPageOwner = user && currentUserID === user.userid;
  const isAdminOrTheUser = user && (isAdmin || currentUserID === user.userid);

  const tabLabels = useMemo(() => {
    const isTabDisabled = (tabLabel) => {
      if (tabLabel === tabValues.PREFERENCES && !isUserPageOwner) return true;
      if (tabLabel === tabValues.CREDITS && !isAdminOrTheUser) return true;

      return false;
    };
    return [
      tabValues.IDENTITY,
      tabValues.ACCOUNT,
      tabValues.PREFERENCES,
      tabValues.CREDITS,
      tabValues.PROPOSALS
    ].filter((tab) => !isTabDisabled(tab));
  }, [isUserPageOwner, isAdminOrTheUser]);

  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);

  // Change Username Modal
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const openUsernameModal = (e) => {
    e.preventDefault();
    setShowUsernameModal(true);
  };
  const closeUsernameModal = () => setShowUsernameModal(false);
  const { username, onChangeUsername, validationSchema } = useChangeUsername();

  const [loadingKey, setKeyAsLoaded] = useState(PUB_KEY_STATUS_LOADING);

  const [pubkey, setPubkey] = useState("");
  const refreshPubKey = useCallback(() => {
    existing(currentUserEmail).then(() => {
      myPubKeyHex(currentUserEmail)
        .then((pubkey) => {
          setPubkey(pubkey);
          setKeyAsLoaded(PUB_KEY_STATUS_LOADED);
        })
        .catch(() => {
          setKeyAsLoaded(PUB_KEY_STATUS_LOADED);
        });
    });
  }, [currentUserEmail, setPubkey]);
  useEffect(() => {
    if (userPubkey !== pubkey) refreshPubKey();
    if (identityImportSuccess) refreshPubKey();
  }, [refreshPubKey, userPubkey, pubkey, identityImportSuccess]);

  const isMobileScreen = useMediaQuery("(max-width:560px)");

  const currentTabComponent =
    user &&
    getTabComponents({
      user,
      isAdminOrTheUser,
      isUserPageOwner,
      isAdmin,
      loadingKey,
      pubkey
    })[tabLabels[index]];

  const tabs = useMemo(
    () => (
      <Tabs
        onSelectTab={onSetIndex}
        className={isMobileScreen ? "padding-bottom-s" : ""}
        activeTabIndex={index}
        mode={isMobileScreen ? "dropdown" : "horizontal"}>
        {tabLabels.map((label) => (
          <Tab key={`tab-${label}`} label={label} />
        ))}
      </Tabs>
    ),
    [tabLabels, onSetIndex, isMobileScreen, index]
  );

  return user ? (
    <>
      <TopBanner>
        <PageDetails
          title={
            <div className={styles.titleWrapper}>
              <Title>
                {isUserPageOwner ? username || user.username : user.username}
              </Title>
              {isUserPageOwner && (
                <Link
                  href="#"
                  onClick={openUsernameModal}
                  className={styles.titleLink}>
                  Change Username
                </Link>
              )}
            </div>
          }
          subtitle={user.email}
          actionsContent={null}>
          {tabs}
        </PageDetails>
      </TopBanner>
      <Main fillScreen className="main">
        {currentTabComponent}
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
