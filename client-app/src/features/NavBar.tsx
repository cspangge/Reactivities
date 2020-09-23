import React, { Fragment, useContext } from "react";
import { Button, Container, Menu } from "semantic-ui-react";
import ActivityStore from "../app/stores/activitiesStore";

const NavBar: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  return (
    <Fragment>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>
            <img
              src="/assets/img/logo.png"
              alt=""
              style={{ marginRight: "12px" }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item name="Activities" />
          <Menu.Item>
            <Button
              positive
              content="Create Activity"
              onClick={activityStore.openCreateForm}
            />
          </Menu.Item>
        </Container>
      </Menu>
    </Fragment>
  );
};

export default NavBar;
