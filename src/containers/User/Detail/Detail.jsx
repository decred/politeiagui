import { Link, useMediaQuery } from "pi-ui";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { withRouter } from "react-router-dom";
import ModalChangeUsername from "src/components/ModalChangeUsername";
import { PUB_KEY_STATUS_LOADED, PUB_KEY_STATUS_LOADING } from "src/constants";
import UserProposals from "src/containers/Proposal/User";
import AllInvoices from "src/containers/Invoice/List";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import useQueryStringWithIndexValue from "src/hooks/utils/useQueryStringWithIndexValue";
import useUserDetail from "src/hooks/api/useUserDetail";
import { useConfig } from "src/containers/Config";
import { existing, myPubKeyHex } from "src/lib/pki";
import Drafts from "./Drafts";
import Account from "./Account";
import Credits from "./Credits";
import styles from "./Detail.module.css";
import { tabValues } from "./helpers";
import useChangeUsername from "./hooks/useChangeUsername";
import Identity from "./Identity";
import Preferences from "./Preferences";
import ManageContractor from "./ManageContractor";
import ProposalsOwned from "./ProposalsOwned";
import Totp from "../Totp";
import useModalContext from "src/hooks/utils/useModalContext";

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
    ),
    [tabValues.INVOICES]: <AllInvoices userID={user.userid} />,
    [tabValues.DRAFTS]: <Drafts key="tab-invoices" />,
    [tabValues.MANAGE_DCC]: <ManageContractor userID={user.userid} {...rest} />,
    [tabValues.PROPOSALS_OWNED]: (
      <ProposalsOwned proposalsOwned={user.proposalsowned} />
    ),
    [tabValues.TOTP]: <Totp />
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
  const { userPubkey, identityImportSuccess } = useUserIdentity();
  const { user, isAdmin, currentUserID } = useUserDetail(userID);

  const {
    recordType,
    enablePaywall,
    constants: { RECORD_TYPE_INVOICE, RECORD_TYPE_PROPOSAL }
  } = useConfig();

  const isUserPageOwner = user && currentUserID === user.userid;
  const isAdminOrTheUser = user && (isAdmin || currentUserID === user.userid);
  const proposalsOwned = user && user.proposalsowned;
  const ownsProposals = proposalsOwned && proposalsOwned.length > 0;

  console.log(enablePaywall);

  const tabLabels = useMemo(() => {
    const isTabDisabled = (tabLabel) => {
      if (tabLabel === tabValues.PREFERENCES && !isUserPageOwner) return true;
      if (
        tabLabel === tabValues.CREDITS &&
        (!isAdminOrTheUser || !enablePaywall)
      )
        return true;
      if (tabLabel === tabValues.MANAGE_DCC && !isAdminOrTheUser) return true;
      if (tabLabel === tabValues.INVOICES && !isAdmin) return true;
      if (tabLabel === tabValues.DRAFTS && !isUserPageOwner) return true;
      if (
        tabLabel === tabValues.PROPOSALS_OWNED &&
        (!isUserPageOwner || !ownsProposals)
      )
        return true;
      if (tabLabel === tabValues.TOTP && !isUserPageOwner) return true;
      return false;
    };
    const filterByRecordType = (tabLabel) => {
      if (recordType === RECORD_TYPE_INVOICE) {
        return (
          tabLabel !== tabValues.PROPOSALS &&
          tabLabel !== tabValues.PREFERENCES &&
          tabLabel !== tabValues.CREDITS
        );
      }
      if (recordType === RECORD_TYPE_PROPOSAL) {
        return (
          tabLabel !== tabValues.MANAGE_DCC &&
          tabLabel !== tabValues.DRAFTS &&
          tabLabel !== tabValues.INVOICES &&
          tabLabel !== tabValues.PROPOSALS_OWNED
        );
      }
      return true;
    };
    return [
      tabValues.IDENTITY,
      tabValues.ACCOUNT,
      tabValues.PREFERENCES,
      tabValues.CREDITS,
      tabValues.PROPOSALS,
      tabValues.INVOICES,
      tabValues.DRAFTS,
      tabValues.MANAGE_DCC,
      tabValues.PROPOSALS_OWNED,
      tabValues.TOTP
    ].filter((tab) => !isTabDisabled(tab) && filterByRecordType(tab));
  }, [
    isUserPageOwner,
    isAdminOrTheUser,
    enablePaywall,
    isAdmin,
    ownsProposals,
    recordType,
    RECORD_TYPE_INVOICE,
    RECORD_TYPE_PROPOSAL
  ]);

  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);

  const { username, onChangeUsername, validationSchema } = useChangeUsername();

  const [loadingKey, setKeyAsLoaded] = useState(PUB_KEY_STATUS_LOADING);

  const [pubkey, setPubkey] = useState("");
  const refreshPubKey = useCallback(
    (isSubscribed) =>
      existing(currentUserID).then(() => {
        myPubKeyHex(currentUserID)
          .then((pubkey) => {
            if (isSubscribed) {
              setPubkey(pubkey);
              setKeyAsLoaded(PUB_KEY_STATUS_LOADED);
            }
          })
          .catch(() => {
            if (isSubscribed) {
              setKeyAsLoaded(PUB_KEY_STATUS_LOADED);
            }
          });
      }),
    [currentUserID, setPubkey]
  );
  useEffect(() => {
    let isSubscribed = true;
    if (userPubkey !== pubkey || identityImportSuccess)
      refreshPubKey(isSubscribed);
    return () => (isSubscribed = false);
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

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenChangeUsernameModal = (e) => {
    e.preventDefault();
    handleOpenModal(ModalChangeUsername, {
      validationSchema: validationSchema,
      onChangeUsername: onChangeUsername,
      onClose: handleCloseModal
    });
  };

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
                  onClick={handleOpenChangeUsernameModal}
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
    </>
  ) : null;
};

export default withRouter(UserDetail);
