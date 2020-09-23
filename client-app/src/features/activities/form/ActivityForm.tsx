import React, {
  FormEvent,
  Fragment,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/model/activity";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import Notification from "../../../app/layout/Notification";
import ActivityStore from "../../../app/stores/activitiesStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

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
    createActivity,
    editActivity,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity,
  } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

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

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // setActivity({ ...activity, [event.target.name]: event.target.value });
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuidv4(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  return (
    <Fragment>
      <Segment clearing>
        <Form>
          <Form.Input
            placeholder="Title"
            value={activity.title}
            name="title"
            onChange={handleInputChange}
          />
          <Form.TextArea
            rows={3}
            placeholder="Description"
            value={activity.description}
            name="description"
            onChange={handleInputChange}
          />
          <Form.Input
            placeholder="Category"
            value={activity.category}
            name="category"
            onChange={handleInputChange}
          />
          <Form.Input
            type="datetime-local"
            placeholder="Date"
            value={activity.date}
            name="date"
            onChange={handleInputChange}
          />
          <Form.Input
            placeholder="City"
            value={activity.city}
            name="city"
            onChange={handleInputChange}
          />
          <Form.Input
            placeholder="Venue"
            value={activity.venue}
            name="venue"
            onChange={handleInputChange}
          />
          <Button
            floated="right"
            positive
            type="submit"
            content="Submit"
            onClick={handleSubmit}
            loading={submitting}
          />
          <Button
            floated="right"
            negative
            type="cancel"
            content="Cancel"
            onClick={() => {
              history.push("/activities");
            }}
          />
        </Form>
      </Segment>
      {showNotification(submitting)}
    </Fragment>
  );
};

export default observer(ActivityForm);
