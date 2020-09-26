import React, { Fragment, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Dropdown, Menu, Image } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";

const NavBar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;

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
          {user && (
            <Menu.Item position="right">
              <Image
                avatar
                spaced="right"
                src={user.image || "/assets/img/user.png"}
              />
              <Dropdown pointing="top left" text={user.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profile/username`}
                    text="My profile"
                    icon="user"
                  />
                  <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
        </Container>
      </Menu>
    </Fragment>
  );
};

export default NavBar;