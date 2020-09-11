import React from "react";
import { Redirect } from "react-router-dom";
import { OverlayTrigger, Button, Popover } from "react-bootstrap";

import { StickyTable, Row, Cell } from "react-sticky-table";

import Select from "react-select";

import OwnershipPopover from "./Popovers/Ownership";
import PredictedScorePopover from "./Popovers/PredictedScore";
import PricePredPopover from "./Popovers/PricePred";

class FantasySport extends React.Component {
  state = {
    redirect: null,
    dfs_summary: [],
  };

  componentDidUpdate() {
    console.log(this.state);
  }

  componentDidMount() {
    this.getDfsData();
  }

  popover = (
    <Popover id="popover-information">
      <Popover.Content>
        Check out our value plays article for the week
      </Popover.Content>
    </Popover>
  );

  clickHandler = () => {
    window.location.assign(
      "https://sporttechdaily.com/our-insights/round-18-value-plays/"
    );
  };

  setMatchData = () => {
    const atsMatchArray = [];
    let matchNames = [{ value: "All Games", label: "All Games" }];

    this.state.dfs_summary.map((item) => atsMatchArray.push(item.match_name));

    let cleanMatchArray = [...new Set(atsMatchArray)];

    cleanMatchArray.map((match) => {
      matchNames.push({ value: match, label: match });
      return null;
    });

    this.setState({ matchNames });
    return null;
  };

  renderTeamSelect = () => {
    return (
      <div>
        <Select
          options={this.state.matchNames}
          onChange={(e) =>
            this.setState({ selectedMatch: e.value }, () => {
              this.setFilteredTable();
            })
          }
          placeholder={"Choose a game"}
        />
      </div>
    );
  };

  setFilteredTable = () => {
    let filteredMatches = [];
    this.state.dfs_summary.map((item) => {
      if (item.match_name === this.state.selectedMatch) {
        filteredMatches.push(item);
      }
      return null;
    });
    this.setState({ filteredMatches });
    return null;
  };

  getDfsData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/dfs_summary`
    );
    const data = await response.json();
    this.setState({ dfs_summary: data.rows }, () => {
      this.setMatchData();
    });
  };

  styleDFSConditionalFormatting = (item) => {
    if (item >= 300) {
      return { backgroundColor: "#63BE7B" };
    } else if (item >= 260 && item <= 300) {
      return { backgroundColor: "#FFEB84" };
    } else if (item >= 226 && item <= 260) {
      return { backgroundColor: "#FFC966" };
    } else {
      return { backgroundColor: "#F8696B" };
    }
  };

  styleOSPrevConditionalFormatting = (item) => {
    if (item >= 50) {
      return { backgroundColor: "#63BE7B" };
    } else if (item >= 30 && item <= 49) {
      return { backgroundColor: "#FFEB84" };
    } else if (item >= 10 && item <= 29) {
      return { backgroundColor: "#FFC966" };
    } else {
      return { backgroundColor: "#F8696B" };
    }
  };

  filteredDfsTable = () => {
    return (
      <div className="tableFixHead">
        <StickyTable>
          <Row>
            <Cell>Player</Cell>
            <OverlayTrigger
              placement="top"
              trigger={["focus", "hover"]}
              overlay={PredictedScorePopover}
            >
              <Cell>
                Predicted<br></br>Score
              </Cell>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              trigger={["focus", "hover"]}
              overlay={PricePredPopover}
            >
              <Cell>
                Price/<br></br>Pred (%)
              </Cell>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              trigger={["focus", "hover"]}
              overlay={OwnershipPopover}
            >
              <Cell>
                Ownership<br></br>Previous Round (%)
              </Cell>
            </OverlayTrigger>
            <Cell>Draftstars Price</Cell>
            <Cell>Team</Cell>
            <Cell>Position</Cell>
            <Cell>Match</Cell>
          </Row>

          {this.state.filteredMatches?.map((item) => {
            return (
              <Row>
                <Cell className="playerFix">{item.player}</Cell>

                <Cell>{Math.round(item.ds_pred)}</Cell>
                <Cell
                  style={this.styleDFSConditionalFormatting(item.price_pred)}
                >
                  {Math.round(item.price_pred)}
                </Cell>
                <Cell
                  style={this.styleOSPrevConditionalFormatting(item.os_prev)}
                >
                  {Math.round(item.os_prev) || "N/A"}
                </Cell>
                <Cell>{Math.round(item.ds_price)}</Cell>
                <Cell>{item.team}</Cell>
                <Cell>{item.pos}</Cell>
                <Cell>{item.match_name}</Cell>
              </Row>
            );
          })}
        </StickyTable>
      </div>
    );
  };

  dfsTable() {
    return (
      <div className="tableFixHead">
        <StickyTable>
          <Row>
            <Cell>Player</Cell>
            <OverlayTrigger
              placement="top"
              trigger={["focus", "hover"]}
              overlay={PredictedScorePopover}
            >
              <Cell>
                Predicted<br></br>Score
              </Cell>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              trigger={["focus", "hover"]}
              overlay={PricePredPopover}
            >
              <Cell>
                Price/<br></br>Pred (%)
              </Cell>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              trigger={["focus", "hover"]}
              overlay={OwnershipPopover}
            >
              <Cell>
                Ownership<br></br>Previous Round(%)
              </Cell>
            </OverlayTrigger>
            <Cell>
              Draftstars<br></br>Price
            </Cell>
            <Cell>Team</Cell>
            <Cell>Position</Cell>
            <Cell>Match</Cell>
          </Row>

          {this.state.dfs_summary.map((item) => {
            return (
              <Row>
                <Cell className="playerFix">{item.player}</Cell>
                <Cell>{Math.round(item.ds_pred)}</Cell>
                <Cell
                  style={this.styleDFSConditionalFormatting(item.price_pred)}
                >
                  {Math.round(item.price_pred)}
                </Cell>

                <Cell
                  style={this.styleOSPrevConditionalFormatting(item.os_prev)}
                >
                  {Math.round(item.os_prev) || "N/A"}
                </Cell>

                <Cell>{Math.round(item.ds_price)}</Cell>
                <Cell>{item.team}</Cell>
                <Cell>{item.pos}</Cell>
                <Cell>{item.match_name}</Cell>
              </Row>
            );
          })}
        </StickyTable>
      </div>
    );
  }

  informationButton = () => {
    return (
      <div className="betting-header">
        <h3>Daily Fantasy Sports</h3>
        <OverlayTrigger
          trigger={["focus", "hover"]}
          placement="auto"
          overlay={this.popover}
        >
          <Button
            onClick={this.clickHandler}
            className="info-button"
            variant="outline-info"
          >
            i
          </Button>
        </OverlayTrigger>
      </div>
    );
  };

  renderTable = () => {
    if (!this.state.selectedMatch || this.state.selectedMatch === "All Games") {
      return this.dfsTable();
    }
    return this.filteredDfsTable();
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div>
        <div>{this.renderTeamSelect()}</div>
        {this.informationButton()}
        <div>{this.renderTable()}</div>
      </div>
    );
  }
}

export default FantasySport;
