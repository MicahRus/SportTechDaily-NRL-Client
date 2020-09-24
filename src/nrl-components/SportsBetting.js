import React from "react";
import { Redirect } from "react-router-dom";
import {
  OverlayTrigger,
  Button,
  Popover,
  Row as BSRow,
  Col,
} from "react-bootstrap";

import SideBar from "./SideBar";
import { StickyTable, Row, Cell } from "react-sticky-table";
import Select from "react-select";

import AtsBestHistoricalPopover from "./Popovers/AtsBestHistorical";
import AtsBestModelPopover from "./Popovers/AtsBestModel";
import BestOddsPopover from "./Popovers/BestOdds";
import FtsBestHistoricalPopover from "./Popovers/FtsBestHistorical";
import FtsBestModelPopover from "./Popovers/FtsBestModel";
import HistoricalPopover from "./Popovers/Historical";
import ModelPopover from "./Popovers/Model";

import "./app.css";

class SportsBetting extends React.Component {
  state = {
    redirect: null,
    market: "ATS",
    match: null,
    ats_summary: [],
    fts_summary: [],
    order: "descending",
    filteredMatches: [],
  };

  popover = (
    <Popover id="popover-information">
      <Popover.Content>
        Check out our article which explains how to get the most out of our
        try-scorer models and analysis
      </Popover.Content>
    </Popover>
  );

  // This will redirect the page to the set url when the information button is clicked
  clickHandler = () => {
    window.location.assign(
      "https://sporttechdaily.com/analytics/predictive-analytics-applied-to-rugby-league-looking-at-try-scorers-in-the-nrl/"
    );
  };

  informationButton = () => {
    if (this.state.market === "ATS") {
      return (
        <div className="betting-header">
          <h3>Anytime Try Scorer</h3>
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
                ats_summary: JSON.parse(localStorage.getItem("ats_summary")),
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
    }

    return (
      <div className="betting-header">
        <h3>First Try Scorer</h3>
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
              fts_summary: JSON.parse(localStorage.getItem("fts_summary")),
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

  componentDidUpdate() {
    console.log(this.state);
  }

  componentDidMount() {
    if (localStorage.getItem("ats_summary")) {
      this.setState({
        ats_summary: JSON.parse(localStorage.getItem("ats_summary")),
      });
    }

    if (localStorage.getItem("fts_summary")) {
      this.setState({
        fts_summary: JSON.parse(localStorage.getItem("fts_summary")),
      });
    }
    this.getFtsData();
    this.getAtsData();
  }

  // Retrieves data from ats_summary table
  getAtsData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_NRL}/ats_summary`
    );
    const data = await response.json();
    localStorage.setItem("ats_summary", JSON.stringify(data.rows));
    this.setState({ ats_summary: data.rows }, () => this.setMatchData());
  };

  // Retrieves data from fts_summary table
  getFtsData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL_NRL}/fts_summary`
    );
    const data = await response.json();
    localStorage.setItem("fts_summary", JSON.stringify(data.rows));
    this.setState({ fts_summary: data.rows });
  };

  // defines array for use in Match Select, data coming from ats_summary.match_name
  setMatchData = () => {
    const atsMatchArray = [];
    let matchNames = [{ value: "All Games", label: "All Games" }];

    this.state.ats_summary.map((item) => atsMatchArray.push(item.match_name));

    let cleanMatchArray = [...new Set(atsMatchArray)];

    cleanMatchArray.map((match) => {
      matchNames.push({ value: match, label: match });
      return null;
    });

    this.setState({ matchNames });
    return null;
  };

  // sets options for Match Select component, taken from matchNames array, defined above
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

  // sets options for Market Select component, hard coded into array.
  // sets state for filtered tables (ATS and FTS)
  renderMarketSelect() {
    const marketOptions = [
      { value: "ATS", label: "Anytime Try Scorer" },
      { value: "FTS", label: "First Try Scorer" },
    ];
    return (
      <div>
        <Select
          options={marketOptions}
          onChange={(e) => {
            this.setState(
              {
                market: e.value,
              },
              () => {
                this.setFilteredTable();
              }
            );
          }}
          placeholder={marketOptions[0].label}
        />
      </div>
    );
  }

  // styling for Odds columns in ATS and FTS tables, compares against Highest Odds column
  styleHighestOdds = (item, highest) => {
    if (item === highest) return { backgroundColor: "yellow" };
  };

  //
  stylePercentages = (item) => {
    if (item * 100 >= 125) {
      return { backgroundColor: "salmon" };
    } else if (item * 100 >= 100 && item * 100 <= 125) {
      return { backgroundColor: "lightGreen" };
    } else {
    }
  };

  setFilteredTable = () => {
    let lowerCaseMarket = `${this.state.market.toLowerCase()}_summary`;
    let selectedTable = this.state[lowerCaseMarket];
    let filteredMatches = [];
    selectedTable.map((item) => {
      if (item.match_name === this.state.selectedMatch) {
        filteredMatches.push(item);
      }

      return null;
    });
    localStorage.setItem("filtered_matches", JSON.stringify(filteredMatches));
    this.setState({ filteredMatches });
    return null;
  };

  headingClickHandler = (e) => {
    let event = e.target.innerText;
    let key = "";
    let type = "";
    let order = this.state.order;
    let summary = null;

    if (this.state.filteredMatches?.length > 0) {
      console.log("hit");
      summary = "filteredMatches";
    }

    summary = `${this.state.market.toLowerCase()}_summary`;
    event = event.replace(/\n/g, " ");

    switch (event) {
      case "Player":
        key = "player";
        type = "text";
        break;
      case "Best Odds":
        key = "highest";
        type = "integer";
        break;
      case "Highest/ Historical (%)":
        key = "high_emp";
        type = "integer";
        break;
      case "Highest/ Model (%)":
        key = "high_mod";
        type = "integer";
        break;
      case "ATS Historical":
        key = "ats_empirical";
        type = "integer";
        break;
      case "ATS Model":
        key = "ats_model";
        type = "integer";
        break;

      case "FTS Historical":
        key = "fts_empirical";
        type = "integer";
        break;
      case "FTS Model":
        key = "fts_model";
        type = "integer";
        break;

      case "SportsBet":
        key = "sb";
        type = "integer";
        break;
      case "Neds":
        key = "neds";
        type = "integer";
        break;
      case "PointsBet":
        key = "pointsbet";
        type = "integer";
        break;
      case "TopSport":
        key = "topsport";
        type = "integer";
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

  filteredAtsTable = () => {
    return (
      <BSRow>
        <Col sm={12} lg={9}>
          <div className="tableFixHead">
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
                  overlay={BestOddsPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Best Odds
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestHistoricalPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Highest/<br></br>Historical (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestModelPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Highest/<br></br>Model (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={HistoricalPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      ATS<br></br>Historical
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={ModelPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      ATS<br></br>Model
                    </a>
                  </Cell>
                </OverlayTrigger>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    SportsBet
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Neds
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    PointsBet
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    TopSport
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
                    Match
                  </a>
                </Cell>
              </Row>
              {this.state.filteredMatches?.map((item) => {
                return (
                  <Row>
                    <Cell className="playerFix">{item.player}</Cell>
                    <Cell>{item.highest || "N/A"}</Cell>
                    <Cell style={this.stylePercentages(item.high_emp)}>
                      {Math.round(item.high_emp * 100) || "N/A"}
                    </Cell>
                    <Cell style={this.stylePercentages(item.high_mod)}>
                      {Math.round(item.high_mod * 100) || "N/A"}
                    </Cell>
                    <Cell>{item.ats_empirical || "N/A"}</Cell>
                    <Cell>{item.ats_model || "N/A"}</Cell>
                    <Cell style={this.styleHighestOdds(item.sb, item.highest)}>
                      {item.sb || "N/A"}
                    </Cell>

                    <Cell
                      style={this.styleHighestOdds(item.neds, item.highest)}
                    >
                      {item.neds || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(
                        item.pointsbet,
                        item.highest
                      )}
                    >
                      {item.pointsbet || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(item.topsport, item.highest)}
                    >
                      {item.topsport || "N/A"}
                    </Cell>
                    <Cell>{item.team}</Cell>
                    <Cell>{item.match_name}</Cell>
                  </Row>
                );
              })}
            </StickyTable>
          </div>
        </Col>
        <SideBar />
      </BSRow>
    );
  };

  atsTable = () => {
    return (
      <BSRow>
        <Col sm={12} lg={9}>
          <div className="tableFixHead">
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
                  overlay={BestOddsPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Best Odds
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestHistoricalPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Highest/<br></br>Historical (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={AtsBestModelPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Highest/<br></br>Model (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={HistoricalPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      ATS<br></br>Historical
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={ModelPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      ATS<br></br>Model
                    </a>
                  </Cell>
                </OverlayTrigger>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    SportsBet
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Neds
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    PointsBet
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    TopSport
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
                    Match
                  </a>
                </Cell>
              </Row>

              {this.state.ats_summary.map((item) => {
                return (
                  <Row>
                    <Cell className="playerFix">{item.player}</Cell>
                    <Cell>{item.highest || "N/A"}</Cell>
                    <Cell style={this.stylePercentages(item.high_emp)}>
                      {Math.round(item.high_emp * 100) || "N/A"}
                    </Cell>
                    <Cell style={this.stylePercentages(item.high_mod)}>
                      {Math.round(item.high_mod * 100) || "N/A"}
                    </Cell>
                    <Cell>{item.ats_empirical || "N/A"}</Cell>
                    <Cell>{item.ats_model || "N/A"}</Cell>
                    <Cell style={this.styleHighestOdds(item.sb, item.highest)}>
                      {item.sb || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(item.neds, item.highest)}
                    >
                      {item.neds || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(
                        item.pointsbet,
                        item.highest
                      )}
                    >
                      {item.pointsbet || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(item.topsport, item.highest)}
                    >
                      {item.topsport || "N/A"}
                    </Cell>
                    <Cell>{item.team}</Cell>
                    <Cell>{item.match_name}</Cell>
                  </Row>
                );
              })}
            </StickyTable>
          </div>
        </Col>
        <SideBar />
      </BSRow>
    );
  };

  renderTable = () => {
    if (this.state.market === "ATS") {
      if (
        !this.state.selectedMatch ||
        this.state.selectedMatch === "All Games"
      ) {
        return this.atsTable();
      }
      return this.filteredAtsTable();
    }
    if (!this.state.selectedMatch || this.state.selectedMatch === "All Games") {
      return this.ftsTable();
    }
    return this.filteredFtsTable();
  };

  ftsTable = () => {
    return (
      <BSRow>
        <Col sm={12} lg={9}>
          <div className="tableFixHead">
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
                  overlay={BestOddsPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Best Odds
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={FtsBestHistoricalPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Highest/<br></br>Historical (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={FtsBestModelPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Highest/<br></br>Model (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={HistoricalPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      FTS<br></br>Historical
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={ModelPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      FTS<br></br>Model
                    </a>
                  </Cell>
                </OverlayTrigger>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    SportsBet
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Neds
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    PointsBet
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    TopSport
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
                    Match
                  </a>
                </Cell>
              </Row>

              {this.state.fts_summary.map((item) => {
                return (
                  <Row>
                    <Cell className="playerFix">{item.player}</Cell>
                    <Cell>{item.highest || "N/A"}</Cell>
                    <Cell style={this.stylePercentages(item.high_emp)}>
                      {Math.round(item.high_emp * 100) || "N/A"}
                    </Cell>
                    <Cell style={this.stylePercentages(item.high_mod)}>
                      {Math.round(item.high_mod * 100) || "N/A"}
                    </Cell>
                    <Cell>{item.fts_empirical || "N/A"}</Cell>
                    <Cell>{item.fts_model || "N/A"}</Cell>
                    <Cell style={this.styleHighestOdds(item.sb, item.highest)}>
                      {item.sb || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(item.neds, item.highest)}
                    >
                      {item.neds || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(
                        item.pointsbet,
                        item.highest
                      )}
                    >
                      {item.pointsbet || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(item.topsport, item.highest)}
                    >
                      {item.topsport || "N/A"}
                    </Cell>
                    <Cell>{item.team}</Cell>
                    <Cell>{item.match_name}</Cell>
                  </Row>
                );
              })}
            </StickyTable>
          </div>
        </Col>
        <SideBar />
      </BSRow>
    );
  };

  filteredFtsTable = () => {
    return (
      <BSRow>
        <Col sm={12} lg={9}>
          <div className="tableFixHead">
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
                  overlay={BestOddsPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Best Odds
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={FtsBestHistoricalPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Highest/<br></br>Historical (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={FtsBestModelPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      Highest/<br></br>Model (%)
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={HistoricalPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      FTS<br></br>Historical
                    </a>
                  </Cell>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  trigger={["focus", "hover"]}
                  overlay={ModelPopover}
                >
                  <Cell>
                    <a
                      className="sticky-table-header"
                      onClick={this.headingClickHandler}
                    >
                      FTS<br></br>Model
                    </a>
                  </Cell>
                </OverlayTrigger>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    SportsBet
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    Neds
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    PointsBet
                  </a>
                </Cell>
                <Cell>
                  <a
                    className="sticky-table-header"
                    onClick={this.headingClickHandler}
                  >
                    TopSport
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
                    Match
                  </a>
                </Cell>
              </Row>

              {this.state.filteredMatches?.map((item) => {
                return (
                  <Row>
                    <Cell className="playerFix">{item.player}</Cell>
                    <Cell>{item.highest || "N/A"}</Cell>
                    <Cell style={this.stylePercentages(item.high_emp)}>
                      {Math.round(item.high_emp * 100) || "N/A"}
                    </Cell>
                    <Cell style={this.stylePercentages(item.high_mod)}>
                      {Math.round(item.high_mod * 100) || "N/A"}
                    </Cell>
                    <Cell>{item.fts_empirical || "N/A"}</Cell>
                    <Cell>{item.fts_model || "N/A"}</Cell>
                    <Cell style={this.styleHighestOdds(item.sb, item.highest)}>
                      {item.sb || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(item.neds, item.highest)}
                    >
                      {item.neds || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(
                        item.pointsbet,
                        item.highest
                      )}
                    >
                      {item.pointsbet || "N/A"}
                    </Cell>
                    <Cell
                      style={this.styleHighestOdds(item.topsport, item.highest)}
                    >
                      {item.topsport || "N/A"}
                    </Cell>
                    <Cell>{item.team}</Cell>
                    <Cell>{item.match_name}</Cell>
                  </Row>
                );
              })}
            </StickyTable>
          </div>
        </Col>
        <SideBar />
      </BSRow>
    );
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <>
        <div>{this.renderMarketSelect()}</div>
        <div>{this.renderTeamSelect()}</div>
        {this.informationButton()}
        <div>{this.renderTable()}</div>
      </>
    );
  }
}

export default SportsBetting;
