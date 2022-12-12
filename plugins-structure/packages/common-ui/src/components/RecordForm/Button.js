import React from "react";
import { useFormContext } from "react-hook-form";
import { Button, classNames } from "pi-ui";
import styles from "./styles.module.css";

export function SaveButton({
  children = "Save",
  onSave = () => {},
  className,
  ...props
}) {
  const { getValues } = useFormContext();
  function handleSave() {
    onSave(getValues());
  }
  return (
    <Button
      kind="secondary"
      onClick={handleSave}
      className={classNames(styles.button, className)}
      {...props}
    >
      {children}
    </Button>
  );
}

export function SubmitButton({ children = "Submit", ...props }) {
  return (
    <Button type="submit" className={styles.button} {...props}>
      {children}
    </Button>
  );
}
