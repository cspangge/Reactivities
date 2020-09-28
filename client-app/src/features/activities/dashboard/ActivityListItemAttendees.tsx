import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { IAttendee } from "../../../app/model/activity";

interface IProps {
  attendees: IAttendee[];
}

const styles = {
  borderColor: "coral",
  borderWidth: "2px",
  borderStyle: "solid",
};

const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item key={attendee.username}>
          <Popup
            header={
              attendee.isHost
                ? attendee.displayName + " (Host)"
                : attendee.displayName
            }
            trigger={
              <Image
                size="mini"
                circular
                src={attendee.image || "/assets/img/user.png"}
                style={attendee.following ? styles : null}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default ActivityListItemAttendees;
