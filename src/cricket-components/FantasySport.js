import React from "react";
import { Redirect } from "react-router-dom";
import { Table, OverlayTrigger } from "react-bootstrap";

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

  setMatchData = () => {
    const atsMatchArray = [];
    let matchNames = [{ value: "All Teams", label: "All Teams" }];

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
        <Table size="sm" bordered striped hover>
          <thead>
            <tr>
              <th>Player</th>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={PredictedScorePopover}
              >
                <th>
                  Predicted<br></br>Score
                </th>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={PricePredPopover}
              >
                <th>
                  Price/<br></br>Pred (%)
                </th>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={OwnershipPopover}
              >
                <th>
                  Ownership<br></br>Previous Round (%)
                </th>
              </OverlayTrigger>
              <th>Draftstars Price</th>
              <th>Team</th>
              <th>Position</th>
              <th>Match</th>
            </tr>
          </thead>
          <tbody>
            {this.state.filteredMatches?.map((item) => {
              return (
                <tr>
                  <td className="playerFix">{item.player}</td>

                  <td>{Math.round(item.ds_pred)}</td>
                  <td
                    style={this.styleDFSConditionalFormatting(item.price_pred)}
                  >
                    {Math.round(item.price_pred)}
                  </td>
                  <td
                    style={this.styleOSPrevConditionalFormatting(item.os_prev)}
                  >
                    {Math.round(item.os_prev) || "N/A"}
                  </td>
                  <td>{Math.round(item.ds_price)}</td>
                  <td>{item.team}</td>
                  <td>{item.pos}</td>
                  <td>{item.match_name}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  };

  dfsTable() {
    return (
      <div className="tableFixHead">
        <Table size="sm" bordered striped hover>
          <thead>
            <tr>
              <th>Player</th>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={PredictedScorePopover}
              >
                <th>
                  Predicted<br></br>Score
                </th>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={PricePredPopover}
              >
                <th>
                  Price/<br></br>Pred (%)
                </th>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={OwnershipPopover}
              >
                <th>
                  Ownership<br></br>Previous Round(%)
                </th>
              </OverlayTrigger>
              <th>
                Draftstars<br></br>Price
              </th>
              <th>Team</th>
              <th>Position</th>
              <th>Match</th>
            </tr>
          </thead>
          <tbody>
            {this.state.dfs_summary.map((item) => {
              return (
                <tr>
                  <td className="playerFix">{item.player}</td>
                  <td>{Math.round(item.ds_pred)}</td>
                  <td
                    style={this.styleDFSConditionalFormatting(item.price_pred)}
                  >
                    {Math.round(item.price_pred)}
                  </td>

                  <td
                    style={this.styleOSPrevConditionalFormatting(item.os_prev)}
                  >
                    {Math.round(item.os_prev) || "N/A"}
                  </td>

                  <td>{Math.round(item.ds_price)}</td>
                  <td>{item.team}</td>
                  <td>{item.pos}</td>
                  <td>{item.match_name}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }

  renderTable = () => {
    if (!this.state.selectedMatch || this.state.selectedMatch === "All Teams") {
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
        <div>
          <h2>Daily Fantasy Sports</h2>
        </div>
        <div>{this.renderTable()}</div>
      </div>
    );
  }
}

export default FantasySport;
