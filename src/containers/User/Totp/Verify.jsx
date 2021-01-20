import React, { useState } from "react";
import PropTypes from "prop-types";
import { H2, P, Text, Button } from "pi-ui";
import DigitsInput from "src/components/DigitsInput";
import { TOTP_CODE_LENGTH } from "src/constants";
import styles from "./Totp.module.css";

const VerifyTotp = ({
  onVerify,
  buttonLabel,
  extended,
  title,
  description,
  className,
  inputClassName,
  onType
}) => {
  const [enableVerify, setEnableVerify] = useState(false);
  const [code, setCode] = useState("");
  const onFillCode = (newCode) => {
    setEnableVerify(newCode.length === TOTP_CODE_LENGTH);
    setCode(newCode);
    onType(newCode);
  };
  const handleVerify = (e) => {
    e && e.preventDefault();
    onVerify(code, () => onFillCode(""));
  };

  return (
    <form className={className}>
      {extended ? (
        <>
          <H2>{title}</H2>
          <P>{description}</P>
        </>
      ) : (
        <Text className={styles.inputLabel}>{title}</Text>
      )}
      <div>
        <DigitsInput
          onChange={onFillCode}
          className={inputClassName}
          code={code}
        />
        {extended && (
          <Button
            type="submit"
            kind={
              enableVerify ? (extended ? "primary" : "secondary") : "disabled"
            }
            onClick={handleVerify}>
            {buttonLabel}
          </Button>
        )}
      </div>
    </form>
  );
};

VerifyTotp.propTypes = {
  onVerify: PropTypes.func.isRequired,
  onType: PropTypes.func,
  buttonLabel: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  extended: PropTypes.bool
};

VerifyTotp.defaultProps = {
  buttonLabel: "Verify",
  extended: true,
  description: "",
  onType: () => {}
};

export default VerifyTotp;
