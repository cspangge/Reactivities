import React from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Icon, Item, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/model/activity";
import { format } from "date-fns";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" circular src="/assets/img/user.png" />
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Description>Hosted by XXX</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Grid>
          <Grid.Column width={4}>
            <Icon name="clock" /> {format(activity.date, "h:mm a")}
          </Grid.Column>
          <Grid.Column width={12}>
            <Icon name="marker" /> {activity.venue}, {activity.city}
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment secondary>Attendee will goes here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  );
};

export default ActivityListItem;
