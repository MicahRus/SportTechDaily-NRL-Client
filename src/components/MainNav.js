import React from "react";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";

import { Redirect } from "react-router-dom";

import logo from "./images/logo.svg";
import home from "./images/home_5.png";

class MainNav extends React.Component {
  state = { redirect: null, eventKey: null };
  navBar = () => {
    let x = window.location.href;
    let y = x.split("/");
    let key = `/${y[y.length - 1]}`;
    if (!this.state.eventKey) {
      this.setState({ eventKey: "/" });
    }
    return (
      <Row style={{ paddingBottom: "15px" }}>
        <Navbar variant="light" collapseOnSelect expand="lg">
          <Navbar.Brand href="/">
            <img
              src={home}
              width="40"
              height="40"
              className="d-inline-block align-top"
              alt="Home button"
            />
          </Navbar.Brand>
          <Navbar.Brand href="https://sporttechdaily.com/">
            <img
              src={logo}
              width="130"
              height="50"
              className="d-inline-block align-top"
              alt="Sport Tech Daily Logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav
              variant="tabs"
              className="main-nav"
              justify
              activeKey={this.state.activeKey}
              defaultActiveKey={key}
            >
              <Nav.Item>
                <Nav.Link
                  onClick={() => {
                    this.setState({ redirect: "/", eventKey: "/" });
                  }}
                  eventKey="/"
                >
                  Betting
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={() => {
                    this.setState({
                      redirect: "/fantasysport",
                      eventKey: "/fantasysport",
                    });
                  }}
                  eventKey="/fantasysport"
                >
                  Fantasy
                </Nav.Link>
              </Nav.Item>
              {/*<Nav.Item>
                <Nav.Link
                  onClick={() => {
                    this.setState({
                      redirect: "/sportsbetting",
                      eventKey: "/sportsbetting",
                    });
                  }}
                  eventKey="/sportsbetting"
                >
                  Betting
                </Nav.Link>
              </Nav.Item> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Row>
    );
  };
  render() {
    if (this.state.redirect) {
      return (
        <>
          <Redirect push to={this.state.redirect} />
          {this.navBar()}
        </>
      );
    }
    return this.navBar();
  }
}

export default MainNav;
