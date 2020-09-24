import React from "react";

import { Redirect } from "react-router-dom";

import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";

class Landing extends React.Component {
  state = { redirect: null };

  redirectButtons = () => {
    return (
      <div>
        <h4> Which Page Would You Like To Visit?</h4>
        <div className="landing-button-container">
          <Button href="/nrl">NRL</Button>
          <Button href="/cricket">Cricket</Button>
        </div>
      </div>
    );
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <Container>
        <div className="landing-container">
          <h1> Landing Page</h1>
          {this.redirectButtons()}
        </div>
      </Container>
    );
  }
}

export default Landing;
