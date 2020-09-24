import React from "react";
import { Redirect } from "react-router-dom";
import {
  OverlayTrigger,
  Button,
  Popover,
  Col,
  Row as BSRow,
} from "react-bootstrap";

import SideBar from "./SideBar";
import { StickyTable, Row, Cell } from "react-sticky-table";

import Select from "react-select";

import OwnershipPopover from "./Popovers/Ownership";
import PredictedScorePopover from "./Popovers/PredictedScore";
import PricePredPopover from "./Popovers/PricePred";

class FantasySport extends React.Component {
  state = {
    redirect: null,
    dfs_summary: [],
    filteredMatches: [],
    market: "DFS",
  };

  componentDidUpdate() {
    console.log(this.state);
  }

  componentDidMount() {
    if (localStorage.getItem("dfs_summary")) {
      this.setState({
        dfs_summary: JSON.parse(localStorage.getItem("dfs_summary")),
      });
    }
    this.getDfsData();
  }

  getDfsData = async () => {
    console.log(process.env.REACT_APP_BACKEND_URL_NRL);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_NRL}/dfs_summary`
    );
    const data = await response.json();
    localStorage.setItem("dfs_summary", JSON.stringify(data.rows));
    this.setState({ dfs_summary: data.rows }, () => {
      this.setMatchData();
    });
  };

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
      <BSRow>
        <Col sm={12} lg={9}>
          <div className="tableFixHead" style={{ height: "77vh" }}>
            <StickyTable>
              <Row>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Player
                  </a>
                </Cell>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={PredictedScorePopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Predicted<br></br>Score
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={PricePredPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Price/<br></br>Pred (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={OwnershipPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Ownership<br></br>Previous Round(%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Draftstars<br></br>Price
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Team
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Position
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Match
                  </a>
                </Cell>
              </Row>

              {this.state.filteredMatches?.map((item) => {
                return (
                  <Row>
                    <Cell className="playerFix">{item.player}</Cell>

                    <Cell>{Math.round(item.ds_pred)}</Cell>
                    <Cell
                      style={this.styleDFSConditionalFormatting(
                        item.price_pred
                      )}
                    >
                      {Math.round(item.price_pred)}
                    </Cell>
                    <Cell
                      style={this.styleOSPrevConditionalFormatting(
                        item.os_prev
                      )}
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
        </Col>
        <Col lg={3}>
          <SideBar />
        </Col>
      </BSRow>
    );
  };

  dfsTable() {
    return (
      <BSRow>
        <Col sm={12} lg={9}>
          <div className="tableFixHead" style={{ height: "77vh" }}>
            <StickyTable>
              <Row>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Player
                  </a>
                </Cell>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={PredictedScorePopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Predicted<br></br>Score
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={PricePredPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Price/<br></br>Pred (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={OwnershipPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Ownership<br></br>Previous Round(%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Draftstars<br></br>Price
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Team
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Position
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Match
                  </a>
                </Cell>
              </Row>

              {this.state.dfs_summary.map((item) => {
                return (
                  <Row>
                    <Cell className="playerFix">{item.player}</Cell>
                    <Cell>{Math.round(item.ds_pred)}</Cell>
                    <Cell
                      style={this.styleDFSConditionalFormatting(
                        item.price_pred
                      )}
                    >
                      {Math.round(item.price_pred)}
                    </Cell>

                    <Cell
                      style={this.styleOSPrevConditionalFormatting(
                        item.os_prev
                      )}
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
        </Col>
        <Col lg={3}>
          <SideBar />
        </Col>
      </BSRow>
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
        <Button
          onClick={() => {
            this.setState({
              dfs_summary: JSON.parse(localStorage.getItem("dfs_summary")),
              filteredMatches: JSON.parse(
                localStorage.getItem("filtered_matches")
              ),
              order: "descending",
            });
          }}
          variant="outline-primary"
          style={{ marginLeft: "15px" }}
        >
          Reset Table
        </Button>
      </div>
    );
  };

  renderTable = () => {
    if (!this.state.selectedMatch || this.state.selectedMatch === "All Games") {
      return this.dfsTable();
    }
    return this.filteredDfsTable();
  };

  headingClickHandler = (e) => {
    let event = e.target.innerText;
    let key = "";
    let type = "";
    let order = this.state.order;
    let summary = null;

    if (this.state.filteredMatches?.length > 0) {
      summary = "filteredMatches";
    }

    summary = `${this.state.market.toLowerCase()}_summary`;
    event = event.replace(/\n/g, " ");

    switch (event) {
      case "Player":
        key = "player";
        type = "text";
        break;
      case "Predicted Score":
        key = "ds_pred";
        type = "integer";
        break;
      case "Price/ Pred (%)":
        key = "price_pred";
        type = "integer";
        break;
      case "Ownership Previous Round(%)":
        key = "os_prev";
        type = "integer";
        break;
      case "Draftstars Price":
        key = "ds_price";
        type = "integer";
        break;
      case "Position":
        key = "pos";
        type = "text";
        break;

      case "Team":
        key = "team";
        type = "text";
        break;
      case "Match":
        key = "match_name";
        type = "text";
        break;
      default:
        console.log("defaulted");
        console.log(event);
        break;
    }

    if (this.state.key !== key) {
      order = "descending";
    }

    if (type === "integer") {
      if (order === "descending") {
        let filteredSummary = JSON.parse(
          JSON.stringify(
            this.state[summary].sort(
              (a, b) => parseFloat(b[key] || 0) - parseFloat(a[key] || 0)
            )
          )
        );

        this.setState({
          [summary]: filteredSummary,
          order: "ascending",
          key,
        });

        if (this.state.filteredMatches.length > 0) {
          this.setState({ filteredMatches: filteredSummary });
        }
      }
      if (order === "ascending") {
        let filteredSummary = JSON.parse(
          JSON.stringify(
            this.state[summary].sort(
              (a, b) => parseFloat(a[key] || 0) - parseFloat(b[key] || 0)
            )
          )
        );
        this.setState({
          [summary]: filteredSummary,
          order: "descending",
          key,
        });

        if (this.state.filteredMatches.length > 0) {
          this.setState({ filteredMatches: filteredSummary });
        }
      }
    }

    if (type === "text") {
      if (order === "descending") {
        let filteredSummary = JSON.parse(
          JSON.stringify(
            this.state[summary].sort((a, b) => {
              let fa = a[key].split(" ").join("").toLowerCase();
              let fb = b[key].split(" ").join("").toLowerCase();

              if (fa < fb) {
                return -1;
              }

              if (fa > fb) {
                return 1;
              }
              return 0;
            })
          )
        );

        this.setState({
          [summary]: filteredSummary,
          order: "ascending",
          key,
        });

        if (this.state.filteredMatches.length > 0) {
          this.setState({ filteredMatches: filteredSummary });
        }
      }

      if (order === "ascending") {
        let filteredSummary = JSON.parse(
          JSON.stringify(
            this.state[summary].sort((a, b) => {
              let fa = a[key].toLowerCase();
              let fb = b[key].toLowerCase();

              if (fa > fb) {
                return -1;
              }

              if (fa < fb) {
                return 1;
              }
              return 0;
            })
          )
        );

        if (this.state.filteredMatches.length > 0) {
          this.setState({ filteredMatches: filteredSummary });
        }

        this.setState({
          [summary]: filteredSummary,
          order: "descending",
          key,
        });
      }
    }
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
