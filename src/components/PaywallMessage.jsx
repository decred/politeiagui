import { Button } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import { useConfig } from "src/containers/Config";
import usePaywall from "src/hooks/api/usePaywall";
import ModalPayPaywall from "./ModalPayPaywall/ModalPayPaywall";
import useModalContext from "src/hooks/utils/useModalContext";
import StaticMarkdown from "./StaticMarkdown";

const PaywallMessage = ({ wrapper, ...props }) => {
  const { paywallContent } = useConfig();
  const { isPaid, currentUserEmail } = usePaywall();
  const WrapperComponent = wrapper;
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const openPaywallModal = () =>
    handleOpenModal(ModalPayPaywall, {
      title: "Complete your registration",
      onClose: handleCloseModal
    });
  const showMessage = !!currentUserEmail && isPaid === false && isPaid !== null;

  return (
    showMessage && (
      <>
        <WrapperComponent {...props}>
          <StaticMarkdown contentName={paywallContent} />
          <Button
            onClick={openPaywallModal}
            className="margin-top-m"
            data-testid="registration-fee-btn"
          >
            Pay the registration fee
          </Button>
        </WrapperComponent>
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
