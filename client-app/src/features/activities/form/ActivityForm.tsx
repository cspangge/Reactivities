import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import { ActivityFormValues } from "../../../app/model/activity";
import "react-native-get-random-values";
// import { v4 as uuidv4 } from "uuid";
import Notification from "../../../app/layout/Notification";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import { category } from "../../../app/common/options/categoryOptions";
import { combineDateAndTime } from "../../../app/common/util/util";

interface DetailsParams {
  id: string;
}

const showNotification = (show: boolean) => {
  return show && <Notification />;
};

const ActivityForm: React.FC<RouteComponentProps<DetailsParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    // createActivity,
    // editActivity,
    submitting,
    loadActivity,
    clearActivity,
  } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  // Ensure API request only apply once
  /** Old code
    useEffect(() => {
      if (match.params.id && activity.id.length === 0)
        loadActivity(match.params.id).then(() => {
          initialFormState && setActivity(initialFormState);
        });
      return () => {
        clearActivity();
      };
    }, [
      clearActivity,
      match.params.id,
      initialFormState,
      activity.id.length,
      loadActivity,
    ]);
   */
  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then(
          (activity) => setActivity(new ActivityFormValues(activity)) // Use constructor to initialize object
        )
        .finally(() => setLoading(false));
    }
  }, [match.params.id, loadActivity]);

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    console.log(activity);
  };

  // const handleInputChange = (
  //   event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   // setActivity({ ...activity, [event.target.name]: event.target.value });
  //   const { name, value } = event.currentTarget;
  //   setActivity({ ...activity, [name]: value });
  // };

  // const handleSubmit = () => {
  //   if (activity.id.length === 0) {
  //     let newActivity = {
  //       ...activity,
  //       id: uuidv4(),
  //     };
  //     createActivity(newActivity).then(() =>
  //       history.push(`/activities/${newActivity.id}`)
  //     );
  //   } else {
  //     editActivity(activity).then(() =>
  //       history.push(`/activities/${activity.id}`)
  //     );
  //   }
  // };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  placeholder="Title"
                  value={activity.title}
                  name="title"
                  component={TextInput}
                />
                <Field
                  placeholder="Description"
                  value={activity.description}
                  name="description"
                  rows={3}
                  component={TextAreaInput}
                />
                <Field
                  placeholder="Category"
                  value={activity.category}
                  name="category"
                  options={category}
                  component={SelectInput}
                />
                <Form.Group widths="equal">
                  <Field
                    placeholder="Date"
                    value={activity.date}
                    name="date"
                    date={true}
                    component={DateInput}
                  />
                  <Field
                    placeholder="Time"
                    value={activity.time}
                    name="time"
                    time={true}
                    component={DateInput}
                  />
                </Form.Group>
                <Field
                  placeholder="City"
                  value={activity.city}
                  name="city"
                  component={TextInput}
                />
                <Field
                  placeholder="Venue"
                  value={activity.venue}
                  name="venue"
                  component={TextInput}
                />
                <Button
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={loading}
                />
                <Button
                  floated="right"
                  negative
                  type="cancel"
                  content="Cancel"
                  onClick={() => {
                    history.push("/activities");
                  }}
                  disabled={loading}
                />
              </Form>
            )}
          />
        </Segment>
        {showNotification(submitting)}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
