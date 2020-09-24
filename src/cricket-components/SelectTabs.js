import React from "react";

import { Form, Col, Row, Tab, Tabs } from "react-bootstrap";

class SelectTabs extends React.Component {
  renderTabs = () => {
    return (
      <Row>
        <Col lg={12} sm={12} id="graph-tabs">
          <Tabs
            defaultActiveKey={this.props.graphType}
            id="graphTypeSelector"
            onSelect={this.props.action}
          >
            <Tab eventKey="radar" title="Radar"></Tab>
            <Tab eventKey="scatter" title="Scatter"></Tab>
            <Tab eventKey="bar" title="Bar"></Tab>
            <Tab eventKey="rankings" title="Rankings"></Tab>
          </Tabs>
        </Col>
      </Row>
    );
  };
  render() {
    return this.renderTabs();
  }
}

export default SelectTabs;
