import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Form, FormFieldProps, Label } from "semantic-ui-react";
import { DateTimePicker } from "react-widgets";

// FieldRenderProps<string, any> here must be any not HTMLInputElement (After 6.3)
interface IProps extends FieldRenderProps<Date, any>, FormFieldProps {}

const DateInput: React.FC<IProps> = ({
  id,
  input,
  width,
  placeholder,
  date = false,
  time = false,
  messages,
  meta: { touched, error },
  ...rest
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <DateTimePicker
        messages={messages}
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        date={date}
        time={time}
        {...rest}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
