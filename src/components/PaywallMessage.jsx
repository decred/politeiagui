import { Button } from "pi-ui";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useConfig } from "src/containers/Config";
import usePaywall from "src/hooks/api/usePaywall";
import ModalPayPaywall from "./ModalPayPaywall/ModalPayPaywall";
import StaticMarkdown from "./StaticMarkdown";

const PaywallMessage = ({ wrapper, ...props }) => {
  const [showModal, setShowModal] = useState(false);
  const openPaywallModal = e => {
    e.preventDefault();
    setShowModal(true);
  };
  const closePaywallModal = () => setShowModal(false);
  const { paywallContent } = useConfig();
  const { userPaywallStatus, paywallAmount } = usePaywall();
  const showMessage = userPaywallStatus < 2 && paywallAmount > 0;
  const WrapperComponent = wrapper;

  return (
    showMessage && (
      <>
        <WrapperComponent {...props}>
          <StaticMarkdown contentName={paywallContent} />
          <Button onClick={openPaywallModal} className="margin-top-m">
            Pay the registration fee
          </Button>
        </WrapperComponent>

        <ModalPayPaywall
          show={showModal}
          title="Complete your registration"
          onClose={closePaywallModal}
        />
      </>
    )
  );
};

PaywallMessage.propTypes = {
  wrapper: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
};

PaywallMessage.defaultProps = {
  wrapper: React.Fragment
};

export default PaywallMessage;
