import React from "react";
import { Row as BSRow, Col, Carousel, Card } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faClock, faUser } from "@fortawesome/free-solid-svg-icons";

import logo from "./images/logo.svg";

class SideBar extends React.Component {
  render() {
    return (
      <Col>
        <BSRow>
          <img
            src={logo}
            width="225px"
            height="150px"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "15px",
            }}
          />
        </BSRow>
        <Carousel style={{ height: "70%" }}>
          <Carousel.Item>
            <Card>
              <Card.Img
                variant="top"
                src="https://sporttechdaily.com/wp-content/uploads/2020/09/SRH_fans_while_an_ipl_match-285x285.jpg"
              />
              <Card.Body>
                <Card.Title>
                  <a href="https://sporttechdaily.com/our-insights/ipl-2020-preview-trends-from-the-last-5-years-looking-at-uae-venues/">
                    IPL 2020 Preview: Trends From The Last 5 Years & Looking At
                    UAE Venues
                  </a>
                </Card.Title>
                <Card.Text>
                  <p style={{ fontSize: "1.5vh" }}>
                    <FontAwesomeIcon icon={faUser} /> {"  "}
                    Sport Tech Daily
                  </p>
                  <p style={{ fontSize: "1.5vh" }}>
                    <FontAwesomeIcon icon={faClock} /> {"  "}4 minute read
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Carousel.Item>
          <Carousel.Item>
            <Card>
              <Card.Img
                variant="top"
                src="https://sporttechdaily.com/wp-content/uploads/2020/09/SRH_fans_while_an_ipl_match-285x285.jpg"
              />
              <Card.Body>
                <Card.Title>
                  <a href="https://sporttechdaily.com/our-insights/round-19-nrl-preview/">
                    Round 19 NRL Preview
                  </a>
                </Card.Title>
                <Card.Text>
                  <p style={{ fontSize: "1.5vh" }}>
                    <FontAwesomeIcon icon={faUser} /> {"  "}
                    Jason Oliver
                  </p>
                  <p style={{ fontSize: "1.5vh" }}>
                    <FontAwesomeIcon icon={faClock} /> {"  "}9 minute read
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Carousel.Item>
          <Carousel.Item>
            <Card>
              <Card.Img
                variant="top"
                src="https://sporttechdaily.com/wp-content/uploads/2020/09/IPL_-_RR_vs_RCB_11th_May_2014-285x285.jpg"
              />
              <Card.Body>
                <Card.Title>
                  <a href="https://sporttechdaily.com/analytics/a-quantitative-review-of-ipl-2019-part-1/">
                    A Quantitative Review Of IPL 2019 (Part 1)
                  </a>
                </Card.Title>
                <Card.Text>
                  <p style={{ fontSize: "1.5vh" }}>
                    <FontAwesomeIcon icon={faUser} /> {"  "}
                    Jay Magodia
                  </p>
                  <p style={{ fontSize: "1.5vh" }}>
                    <FontAwesomeIcon icon={faClock} /> {"  "}7 minute read
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Carousel.Item>
        </Carousel>
      </Col>
    );
  }
}

export default SideBar;
