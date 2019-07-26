import { Button, Card } from "pi-ui";
import React, { useState } from "react";
import { useConfig } from "src/Config";
import usePaywall from "src/hooks/usePaywall";
import ModalPayPaywall from "./ModalPayPaywall/ModalPayPaywall";
import StaticMarkdown from "./StaticMarkdown";

const PaywallMessage = () => {
  const [showModal, setShowModal] = useState(false);
  const openPaywallModal = e => {
    e.preventDefault();
    setShowModal(true);
  };
  const closePaywallModal = () => setShowModal(false);
  const { paywallContent } = useConfig();
  const { userPaywallStatus, paywallAmount } = usePaywall();
  const showMessage = userPaywallStatus < 2 && paywallAmount > 0;
  return (
    <>
      {showMessage ? (
        <>
          <Card className="margin-bottom-s" paddingSize="small" marker>
            <StaticMarkdown contentName={paywallContent} />
            <Button onClick={openPaywallModal} className="margin-top-m">
              Pay the registration fee
            </Button>
          </Card>
        </>
      ) : null}
      <ModalPayPaywall
        show={showModal}
        title="Complete your registration"
        onClose={closePaywallModal}
      />
    </>
  );
};

export default PaywallMessage;
