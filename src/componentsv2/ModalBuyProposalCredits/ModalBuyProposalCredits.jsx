import {
  Button,
  classNames,
  Modal,
  Text,
  useMediaQuery,
  NumberInput
} from "pi-ui";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import FormWrapper from "src/componentsv2/FormWrapper";
import PaymentComponent from "../PaymentComponent";
import PaymentStatusTag from "../PaymentStatusTag";
import styles from "./ModalBuyProposalCredits.module.css";
import { validationSchema } from "./validation";

const ModalBuyProposalCredits = ({
  show,
  onClose,
  price,
  initialStep = 0,
  address,
  status,
  isPollingCreditsPayment,
  startPollingPayment
}) => {
  const [number, setNumber] = useState(1);
  const customOnClose = () => {
    onClose();
    // Wait the transition finish to change the modal type
    setTimeout(() => setModalType(initialStep), 300);
  };
  const [modalType, setModalType] = useState(initialStep);
  function handleGoToPaymentDetails(values) {
    setModalType(1);
    console.log(values);
    console.log(values.number);
    setNumber(+values.number);
  }
  useEffect(() => {
    if (!isPollingCreditsPayment && modalType === 1) startPollingPayment();
  }, [isPollingCreditsPayment, startPollingPayment, modalType]);

  const extraSmall = useMediaQuery("(max-width: 560px)");
  return modalType ? (
    <Modal show={show} onClose={customOnClose} title="Complete your purchase">
      {extraSmall && <PaymentStatusTag status={status} />}
      <PaymentComponent
        address={address}
        amount={+(number * price).toFixed(1)}
        extraSmall={extraSmall}
        status={status}
      />
    </Modal>
  ) : (
    <Modal
      show={show}
      onClose={customOnClose}
      title="Purchase Proposal Credits"
      contentStyle={{ width: "100%" }}>
      <FormWrapper
        initialValues={{
          number: "1"
        }}
        validationSchema={validationSchema}
        onSubmit={handleGoToPaymentDetails}>
        {({
          Form,
          ErrorMessage,
          values,
          handleChange,
          handleSubmit,
          errors
        }) => {
          console.log(errors);
          const disableNext = (errors && errors.number) || !+values.number;
          return (
            <Form onSubmit={handleSubmit}>
              <div>
                <Text>How many credits do you want to buy? </Text>
                <NumberInput
                  id="number"
                  name="number"
                  value={values.number}
                  onChange={handleChange}
                />
                {errors && errors.number && (
                  <ErrorMessage>{errors.number}</ErrorMessage>
                )}
              </div>
              <div className="margin-top-s">
                <Text color="gray">Each proposal credit costs 0.1 DCR</Text>
              </div>
              <div className={classNames("margin-top-l", styles.actionButtons)}>
                <Button onClick={customOnClose} kind="secondary">
                  Back
                </Button>
                <Button
                  kind={(disableNext && "disabled") || "primary"}
                  type="submit">
                  Next
                </Button>
              </div>
            </Form>
          );
        }}
      </FormWrapper>
    </Modal>
  );
};

ModalBuyProposalCredits.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func
};

export default ModalBuyProposalCredits;
