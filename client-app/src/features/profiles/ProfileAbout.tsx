import React, { Fragment, useContext, useState } from "react";
import { Button, Form, Grid, Header, Label, Tab } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../app/common/form/TextInput";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan,
} from "revalidate";
import { observer } from "mobx-react-lite";

const validate = combineValidators({
  displayName: composeValidators(
    isRequired("Display Name"),
    hasLengthGreaterThan(4)("Display Name")
  )(),
  bio: composeValidators(isRequired("Bio"), hasLengthGreaterThan(4)("Bio"))(),
});

const ProfileAbout = () => {
  const rootStore = useContext(RootStoreContext);
  const { isCurrentUser, profile, editProfile } = rootStore.profileStore;
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFinalFormSubmit = (values: any) => {
    setSubmitting(true);
    editProfile(values).then(() => {
      setTimeout(() => {
        setEditMode(false);
        setSubmitting(false);
      }, 3000);
    });
  };

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" content="Profile" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editMode ? "Cancel" : "Edit Profile"}
              onClick={() => setEditMode(!editMode)}
            />
          )}
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Column width={16}>
          <Fragment>
            <FinalForm
              validate={profile?.bio ? validate : undefined}
              onSubmit={handleFinalFormSubmit}
              initialValues={profile!}
              render={({ invalid, pristine, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <Label
                    content="Display Name"
                    size="large"
                    style={{ marginBottom: "12px" }}
                  />
                  <Field
                    name="displayName"
                    component={TextInput}
                    placeholder="Display Name"
                    readOnly={!editMode}
                    value={profile!.displayName}
                  />
                  <Label
                    content="Bio"
                    size="large"
                    style={{ marginBottom: "12px" }}
                  />
                  <Field
                    name="bio"
                    component={TextAreaInput}
                    placeholder="Tell us more about you..."
                    readOnly={!editMode}
                    value={profile!.bio}
                  />
                  {editMode && (
                    <Button
                      floated="right"
                      positive
                      type="submit"
                      content="Update"
                      loading={submitting}
                      onClick={handleSubmit}
                      disabled={submitting || invalid || pristine}
                    />
                  )}
                </Form>
              )}
            />
          </Fragment>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileAbout);
