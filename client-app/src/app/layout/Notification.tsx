import React from "react";
import { Message, Icon } from "semantic-ui-react";

const Notification = () => {
  return (
    <Message icon attached color="blue">
      <Icon name="circle notched" loading />
      <Message.Content>
        <Message.Header>Just one second</Message.Header>
      </Message.Content>
    </Message>
  );
};

export default Notification;
