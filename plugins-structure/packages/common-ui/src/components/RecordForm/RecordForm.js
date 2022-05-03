import React from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { BoxTextInput, Button, Card, Message, Select, classNames } from "pi-ui";
import styles from "./styles.module.css";
import { MarkdownEditor } from "../Markdown";
import { DatePickerInput } from "./DatePickerInput";

function TextInput({ name = "name", placeholder }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value } }) => (
        <BoxTextInput
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          inputClassName={styles.input}
        />
      )}
    />
  );
}

function CurrencyInput({ name = "amount", placeholder }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className={styles.currency}>
          <span className={styles.currencyValue}>$</span>
          <BoxTextInput
            type="number"
            inputClassName={classNames(styles.numberInput)}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
          />
        </div>
      )}
    />
  );
}

function SelectInput({ name = "select", options, ...props }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value } }) => (
        <Select
          options={options}
          value={value}
          onChange={onChange}
          className={styles.select}
          {...props}
        />
      )}
    />
  );
}

function MarkdownInput({ name, initialValue, ...props }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange } }) => (
        <MarkdownEditor
          wrapperClassName={styles.markdownInput}
          onChange={onChange}
          initialValue={initialValue}
          {...props}
        />
      )}
    />
  );
}

function SubmitButton({ children = "Submit", ...props }) {
  return (
    <Button type="submit" className={styles.button} {...props}>
      {children}
    </Button>
  );
}

function SaveButton({
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

function Warning({ children }) {
  return (
    <Message kind="warning" className={styles.warning}>
      {children}
    </Message>
  );
}

export function RecordForm({ initialValues, children, onSubmit }) {
  const formProps = useForm({ defaultValues: initialValues });
  return (
    <Card paddingSize="small">
      <FormProvider {...formProps}>
        <form
          onSubmit={formProps.handleSubmit(onSubmit)}
          className={styles.form}
        >
          {children({
            formProps,
            CurrencyInput,
            DatePickerInput,
            MarkdownInput,
            SaveButton,
            SelectInput,
            SubmitButton,
            TextInput,
            Warning,
          })}
        </form>
      </FormProvider>
    </Card>
  );
}
