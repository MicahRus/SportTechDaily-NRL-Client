import React from "react";

import Row from "react-bootstrap/Row";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Footer extends React.Component {
  render() {
    return (
      <Row>
        <footer>
          <p>© 2020 Sport Tech Daily. All rights reserved.</p>
          <p> Connect with us here</p>
          <Image src="./images/home_5.png/171x180" roundedCircle />
          <Image src="./images/home_5.png" roundedCircle />
        </footer>
      </Row>
    );
  }
}

export default Footer;
