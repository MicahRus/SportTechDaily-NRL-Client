import React from "react";

import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/Overlay";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEnvelopeSquare } from "@fortawesome/free-solid-svg-icons";

import {
  faFacebook,
  faTwitter,
  faInstagram,
  faSpotify,
} from "@fortawesome/free-brands-svg-icons";

import Modal from "react-bootstrap/Modal";

class Footer extends React.Component {
  state = { modalShow: false };

  componentDidUpdate() {
    console.log(this.state);
  }

  renderFooter = () => {
    const tooltip = <Tooltip id="button-tooltip">Simple tooltip</Tooltip>;
    return (
      <Row>
        <div className="footer">
          <footer>
            <span id="copyright">
              © 2020 Sport Tech Daily. All rights reserved.
            </span>
          </footer>

          <footer>
            <a
              onClick={() => this.setState({ modalShow: true })}
              className="social"
            >
              <FontAwesomeIcon icon={faEnvelopeSquare} size="2x" />
            </a>

            <a href="https://twitter.com/SportTechDaily/" className="social">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>

            <a
              href="https://www.linkedin.com/company/sport-tech-daily/"
              className="social"
            >
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a
              href="https://open.spotify.com/show/0l3ZkhSc3w9MUQeu4Cz0nD?t=0"
              className="social"
            >
              <FontAwesomeIcon icon={faSpotify} size="2x" />
            </a>
          </footer>
        </div>
      </Row>
    );
  };

  changeHandler = () => {
    this.setState({ modalShow: false });
  };

  renderModal = () => {
    return (
      <Modal
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.state.modalShow}
        onHide={this.changeHandler}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Contact Us
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <FontAwesomeIcon icon={faEnvelopeSquare} size="1x" />{" "}
            hello@sporttechdaily.com
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.changeHandler}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  render() {
    return (
      <div>
        {this.renderFooter()}
        {this.renderModal()}
      </div>
    );
  }
}

export default Footer;
