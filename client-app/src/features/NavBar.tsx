import React, { Fragment } from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface IProps {
  openCreateForm: () => void;
}

const NavBar: React.FC<IProps> = ({ openCreateForm }) => {
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
              onClick={openCreateForm}
            />
          </Menu.Item>
        </Container>
      </Menu>
    </Fragment>
  );
};

export default NavBar;
