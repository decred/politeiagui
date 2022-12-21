import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, classNames } from "pi-ui";
import styles from "./styles.module.css";
import { DatePickerInput } from "./DatePickerInput";
import { ErrorMessage, InfoMessage, Warning } from "./Message";
import { SaveButton, SubmitButton } from "./Button";
import {
  Checkbox,
  CurrencyInput,
  DigitsInput,
  FileInput,
  Input,
  MarkdownInput,
  NumberInput,
  SelectInput,
  TextInput,
} from "./Input";
import isFunction from "lodash/isFunction";

export function RecordForm({
  initialValues,
  children,
  onSubmit,
  className,
  formClassName,
  autoComplete = "on",
  ...props
}) {
  const formProps = useForm({ defaultValues: initialValues, ...props });
  return (
    <Card className={classNames(styles.card, className)}>
      <FormProvider {...formProps}>
        <form
          onSubmit={formProps.handleSubmit(onSubmit)}
          className={classNames(styles.form, formClassName)}
          data-testid="record-form"
          autoComplete={autoComplete}
        >
          {isFunction(children)
            ? children({
                formProps,
                Checkbox,
                CurrencyInput,
                DatePickerInput,
                DigitsInput,
                ErrorMessage,
                MarkdownInput,
                NumberInput,
                SaveButton,
                SelectInput,
                SubmitButton,
                TextInput,
                FileInput,
                Input,
                Warning,
                InfoMessage,
              })
            : children}
        </form>
      </FormProvider>
    </Card>
  );
}
