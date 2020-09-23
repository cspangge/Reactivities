import React from "react";
import { Link } from "react-router-dom";
import { Container } from "semantic-ui-react";

const HomePage = () => {
  return (
    <Container style={{ marginTop: "7em" }}>
      <div>
        <h1>Home Page</h1>
        <h3>
          Go to <Link to="/activities">Activities</Link>
        </h3>
      </div>
    </Container>
  );
};

export default HomePage;
