import React from "react";
import { Redirect } from "react-router-dom";
import { OverlayTrigger, Button, Popover } from "react-bootstrap";
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
          <h3>Anytime Try Scorer Odds</h3>
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
      </div>
    );
  };

  componentDidUpdate() {
    console.log(this.state);
  }
  componentDidMount() {
    if (localStorage.getItem("AtsData")) {
      this.setState({
        ats_summary: JSON.parse(localStorage.getItem("AtsData")),
      });
    }

    if (localStorage.getItem("FtsData")) {
      this.setState({
        fts_summary: JSON.parse(localStorage.getItem("FtsData")),
      });
    }
    this.getFtsData();
    this.getAtsData();
  }

  // Retrieves data from ats_summary table
  getAtsData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/ats_summary`
    );
    const data = await response.json();
    localStorage.setItem("AtsData", JSON.stringify(data.rows));
    this.setState({ ats_summary: data.rows }, () => this.setMatchData());
  };

  // Retrieves data from fts_summary table
  getFtsData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/fts_summary`
    );
    const data = await response.json();
    localStorage.setItem("FtsData", JSON.stringify(data.rows));
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
    this.setState({ filteredMatches });
    return null;
  };

  filteredAtsTable = () => {
    return (
      <div>
        {this.informationButton()}
        <div className="tableFixHead">
          <StickyTable>
            <Row>
              <Cell>Player</Cell>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={BestOddsPopover}
              >
                <Cell>Best Odds</Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={AtsBestHistoricalPopover}
              >
                <Cell>
                  Highest/<br></br>Historical (%)
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={AtsBestModelPopover}
              >
                <Cell>
                  Highest/<br></br>Model (%)
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={HistoricalPopover}
              >
                <Cell>
                  ATS<br></br>Historical
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={ModelPopover}
              >
                <Cell>
                  ATS<br></br>Model
                </Cell>
              </OverlayTrigger>
              <Cell>SportsBet</Cell>
              <Cell>Neds</Cell>
              <Cell>PointsBet</Cell>
              <Cell>TopSport</Cell>
              <Cell>Team</Cell>
              <Cell>Match</Cell>
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

                  <Cell style={this.styleHighestOdds(item.neds, item.highest)}>
                    {item.neds || "N/A"}
                  </Cell>
                  <Cell
                    style={this.styleHighestOdds(item.pointsbet, item.highest)}
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
      </div>
    );
  };

  atsTable = () => {
    return (
      <div>
        {this.informationButton()}
        <div className="tableFixHead">
          <StickyTable>
            <Row>
              <Cell>Player</Cell>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={BestOddsPopover}
              >
                <Cell>Best Odds</Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={AtsBestHistoricalPopover}
              >
                <Cell>
                  Highest/<br></br>Historical (%)
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={AtsBestModelPopover}
              >
                <Cell>
                  Highest/<br></br>Model (%)
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={HistoricalPopover}
              >
                <Cell>
                  ATS<br></br>Historical
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={ModelPopover}
              >
                <Cell>
                  ATS<br></br>Model
                </Cell>
              </OverlayTrigger>
              <Cell>SportsBet</Cell>
              <Cell>Neds</Cell>
              <Cell>PointsBet</Cell>
              <Cell>TopSport</Cell>
              <Cell>Team</Cell>
              <Cell>Match</Cell>
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
                  <Cell style={this.styleHighestOdds(item.neds, item.highest)}>
                    {item.neds || "N/A"}
                  </Cell>
                  <Cell
                    style={this.styleHighestOdds(item.pointsbet, item.highest)}
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
      </div>
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
      <div>
        {this.informationButton()}
        <div className="tableFixHead">
          <StickyTable>
            <Row>
              <Cell>Player</Cell>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={BestOddsPopover}
              >
                <Cell>Best Odds</Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={FtsBestHistoricalPopover}
              >
                <Cell>
                  Highest/<br></br>Historical (%)
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={FtsBestModelPopover}
              >
                <Cell>
                  Highest/<br></br>Model (%)
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={HistoricalPopover}
              >
                <Cell>
                  FTS<br></br>Historical
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={ModelPopover}
              >
                <Cell>
                  FTS<br></br>Model
                </Cell>
              </OverlayTrigger>
              <Cell>SportsBet</Cell>
              <Cell>Neds</Cell>
              <Cell>PointsBet</Cell>
              <Cell>TopSport</Cell>
              <Cell>Team</Cell>
              <Cell>Match</Cell>
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
                  <Cell style={this.styleHighestOdds(item.neds, item.highest)}>
                    {item.neds || "N/A"}
                  </Cell>
                  <Cell
                    style={this.styleHighestOdds(item.pointsbet, item.highest)}
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
      </div>
    );
  };

  filteredFtsTable = () => {
    return (
      <div>
        {this.informationButton()}
        <div className="tableFixHead">
          <StickyTable>
            <Row>
              <Cell>Player</Cell>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={BestOddsPopover}
              >
                <Cell>Best Odds</Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={AtsBestHistoricalPopover}
              >
                <Cell>
                  Highest/<br></br>Historical (%)
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={AtsBestModelPopover}
              >
                <Cell>
                  Highest/<br></br>Model (%)
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={HistoricalPopover}
              >
                <Cell>
                  FTS<br></br>Historical
                </Cell>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                trigger={["focus", "hover"]}
                overlay={ModelPopover}
              >
                <Cell>
                  FTS<br></br>Model
                </Cell>
              </OverlayTrigger>
              <Cell>SportsBet</Cell>
              <Cell>Neds</Cell>
              <Cell>PointsBet</Cell>
              <Cell>TopSport</Cell>
              <Cell>Team</Cell>
              <Cell>Match</Cell>
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
                  <Cell style={this.styleHighestOdds(item.neds, item.highest)}>
                    {item.neds || "N/A"}
                  </Cell>
                  <Cell
                    style={this.styleHighestOdds(item.pointsbet, item.highest)}
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
      </div>
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
        <div>{this.renderTable()}</div>
      </>
    );
  }
}

export default SportsBetting;
