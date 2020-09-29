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
  meta: { touched, error },
  ...rest
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <DateTimePicker
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        date={date}
        time={time}
        onBlur={input.onBlur}
        onKeyDown={(e) => {
          e.preventDefault(); // Prevent input from keyboard, only select from component is available
        }}
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
