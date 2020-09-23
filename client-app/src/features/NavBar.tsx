import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";

const NavBar: React.FC = () => {
  return (
    <Fragment>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header as={NavLink} exact to="/">
            <img
              src="/assets/img/logo.png"
              alt=""
              style={{ marginRight: "12px" }}
            />
            Reactivities
          </Menu.Item>
          <Menu.Item name="Activities" as={NavLink} exact to="/activities" />
          <Menu.Item>
            <Button
              positive
              content="Create Activity"
              as={NavLink}
              to="/createActivity"
            />
          </Menu.Item>
        </Container>
      </Menu>
    </Fragment>
  );
};

export default NavBar;
