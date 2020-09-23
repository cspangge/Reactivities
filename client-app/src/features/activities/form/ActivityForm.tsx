import React, { FormEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/model/activity";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IActivity;
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
}

const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initialFormState,
  createActivity,
  editActivity,
}) => {
  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

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
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  return (
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
        />
        <Button
          floated="right"
          negative
          type="cancel"
          content="Cancel"
          onClick={() => setEditMode(false)}
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
