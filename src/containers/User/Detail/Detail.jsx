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
import { useChangeUsername, useUserDetail } from "./hooks";
import Identity from "./Identity";
import Preferences from "./Preferences";

const getTabComponents = ({ user, ...rest }) => {
  const mapTabValueToComponent = {
    [tabValues.IDENTITY]: <Identity key="tab-identity" {...user} {...rest} />,
    [tabValues.ACCOUNT]: <Account key="tab-account" {...user} {...rest} />,
    [tabValues.PREFERENCES]: <Preferences key="tab-preferences" {...rest} />,
    [tabValues.CREDITS]: <Credits key="tab-credits" {...rest} />,
    [tabValues.PROPOSALS]: (
      <UserProposals
        key="tab-proposals"
        userID={user.id}
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
  const { user, isAdmin, userId, loggedInAsUserId } = useUserDetail({ match });
  const {
    loggedInAsEmail,
    userPubkey,
    identityImportSuccess
  } = useUserIdentity();

  const isUserPageOwner = user && loggedInAsUserId === user.id;
  const isAdminOrTheUser = user && (isAdmin || loggedInAsUserId === user.id);

  const tabLabels = useMemo(() => {
    const isTabDisabled = tabLabel => {
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
    ].filter(tab => !isTabDisabled(tab));
  }, [isUserPageOwner, isAdminOrTheUser]);

  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);

  // Change Username Modal
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const openUsernameModal = e => {
    e.preventDefault();
    setShowUsernameModal(true);
  };
  const closeUsernameModal = () => setShowUsernameModal(false);
  const { username, onChangeUsername, validationSchema } = useChangeUsername();

  const [loadingKey, setKeyAsLoaded] = useState(PUB_KEY_STATUS_LOADING);

  const [pubkey, setPubkey] = useState("");
  const refreshPubKey = useCallback(() => {
    existing(loggedInAsEmail).then(() => {
      myPubKeyHex(loggedInAsEmail)
        .then(pubkey => {
          setPubkey(pubkey);
          setKeyAsLoaded(PUB_KEY_STATUS_LOADED);
        })
        .catch(() => {
          setKeyAsLoaded(PUB_KEY_STATUS_LOADED);
        });
    });
  }, [loggedInAsEmail, setPubkey]);
  useEffect(() => {
    if (userPubkey !== pubkey) refreshPubKey();
    if (identityImportSuccess) refreshPubKey();
  }, [refreshPubKey, userPubkey, pubkey, identityImportSuccess]);

  const isMobileScreen = useMediaQuery("(max-width:560px)");

  const currentTabComponent =
    user && getTabComponents({
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
        mode={isMobileScreen ? "dropdown" : "horizontal"}
      >
        {tabLabels.map(label => (
          <Tab key={`tab-${label}`} label={label} />
        ))}
      </Tabs>
    ),
    [tabLabels, onSetIndex, isMobileScreen, index]
  );

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
          {tabs}
        </PageDetails>
      </TopBanner>
      <Main fillScreen className="main">{currentTabComponent}</Main>
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
