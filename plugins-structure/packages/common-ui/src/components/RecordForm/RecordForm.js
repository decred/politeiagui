import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Card, classNames } from "pi-ui";
import styles from "./styles.module.css";
import { DatePickerInput } from "./DatePickerInput";
import { ErrorMessage, Warning } from "./Message";
import { SaveButton, SubmitButton } from "./Button";
import {
  Checkbox,
  CurrencyInput,
  MarkdownInput,
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
}) {
  const formProps = useForm({ defaultValues: initialValues });
  return (
    <Card className={classNames(styles.card, className)}>
      <FormProvider {...formProps}>
        <form
          onSubmit={formProps.handleSubmit(onSubmit)}
          className={classNames(styles.form, formClassName)}
          data-testid="record-form"
        >
          {isFunction(children)
            ? children({
                formProps,
                Checkbox,
                CurrencyInput,
                DatePickerInput,
                ErrorMessage,
                MarkdownInput,
                SaveButton,
                SelectInput,
                SubmitButton,
                TextInput,
                Warning,
              })
            : children}
        </form>
      </FormProvider>
    </Card>
  );
}
