import { FORM_ERROR } from "final-form";
import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header, Message, Icon } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { IUserFormValues } from "../../app/model/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import {
  combineValidators,
  isRequired,
  matchesPattern,
  composeValidators,
  hasLengthGreaterThan,
} from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { Link } from "react-router-dom";
import RegisterForm from "./RegisterForm";

const validate = combineValidators({
  email: composeValidators(
    isRequired,
    matchesPattern(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )({ message: "Invalid Email" }),
  password: composeValidators(
    isRequired,
    hasLengthGreaterThan(5)({ message: "Invalid Password" }),
    matchesPattern(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
    )({ message: "Invalid Password" })
  )("Password"),
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <div>
          <Form
            onSubmit={handleSubmit}
            error
            className="attached fluid segment"
          >
            <Header
              as="h2"
              content="Login to Reactivities"
              color="teal"
              textAlign="center"
            />
            <Field name="email" component={TextInput} placeholder="Email" />
            <Field
              name="password"
              component={TextInput}
              placeholder="Password"
              type="password"
            />
            {submitError && !dirtySinceLastSubmit && (
              // <Label color="red" basic content={submitError.statusText} />
              // <Label
              //   color="red"
              //   basic
              //   content={"Username or password incorrect"}
              // />
              <ErrorMessage
                error={submitError}
                text="Username or password incorrect"
              />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              positive
              content="Login"
              fluid
            />
          </Form>
          <Message attached="bottom" warning>
            <Icon name="help" />
            Still don't have an account yet?&nbsp;
            <Link to="#" onClick={() => openModal(<RegisterForm />)}>
              Register here
            </Link>
            &nbsp;instead.
          </Message>
        </div>
      )}
    />
  );
};

export default LoginForm;
