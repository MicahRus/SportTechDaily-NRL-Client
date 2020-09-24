import React from "react";

import { Col, Container, Row } from "react-bootstrap";

import SelectTabs from "./SelectTabs";
import PlayerSelect from "./PlayerSelect";
import Filters from "./Filters";
import RenderRadar from "./RenderRadar";
import SideBar from "../shared-components/SideBar";

class Home extends React.Component {
  state = {
    loaded: false,
    graphType: "radar",
    competition: ["domestic", "international"],
    selectedStats: [
      "Runs",
      "Fours",
      "Sixes",
      "Batting Average",
      "Death Strike Rate",
      "Power Play Strike Rate",
      "Batting Strike Rate",
      "Balls Per Boundary",
      "Dot Ball Percentage",
    ],
    selectedLeagues: [],
    post2017LeagueStats: [],
  };

  componentDidMount() {
    this.getAllStats();
    this.getManOfTheMatch();
    if (localStorage.getItem("data")) {
      this.useStoredData();
    }
    this.getAllData();
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  renderPage = () => {
    // Error catching logic to ensure data is loaded
    if (this.state.failedFetch) {
      return (
        <div>
          {" "}
          <h1> Oh no....</h1>
          <p>
            {" "}
            Sorry that something went wrong when trying to use our page, please
            report the bug to us and we'll get straight on fixing it.
          </p>
        </div>
      );
    }

    if (this.state.loaded) {
      return (
        <Row>
          {this.renderControls()}
          <RenderRadar
            player1={this.state.player1}
            player2={this.state.player2}
            radarChartData={this.state.radarChartData}
          />
          <Col xl={3}>
            <SideBar />
          </Col>
        </Row>
      );
    } else {
      return (
        <Container>
          <h1> Page Loading</h1>
        </Container>
      );
    }
  };

  useStoredData = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    this.setDataToState(data);
  };

  // This function will get all the promises from the different fetch requests and push them into state
  getAllData = async () => {
    const data = await Promise.all([
      this.getAllPlayers(),
      this.getAllPlayerStats(),
      this.getAllVenues(),
      this.getAllLeagues(),
      this.getPost2017Players(),
      this.getDomesticLeagues(),
      this.getInternationalLeagues(),
    ]);

    localStorage.setItem("data", JSON.stringify(data));

    this.initialDataSetup();
    // This function handles setting the fetched data into state
    this.setDataToState(data);
  };

  initialDataSetup = () => {
    this.setState({
      player1: { value: "253802", label: "Virat Kohli" },
      player2: { value: "34102", label: "Rohit Sharma" },
    });
    this.getSelectedPlayerStats("253802", "player1Stats");
    this.getSelectedPlayerStats("34102", "player2Stats");
  };

  setDataToState = (data) => {
    this.setState(
      {
        allPlayersData: data[0],
        allPlayersStats: data[1],
        allVenues: data[2],
        allLeagues: data[3],
        post2017Players: data[4],
      },
      () => {
        // This function will load the actual page instead of the skeleton
        this.setState({ loaded: true });
      }
    );
  };

  getAllPlayerStats = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/players/stats`
      );
      const data = await response.json();

      return data.rows;
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  getAllPlayers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/players`
      );
      const data = await response.json();
      return data.rows;
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  getPost2017Players = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/players/post2017`
      );
      const data = await response.json();
      return data.rows;
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  getAllVenues = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/venues`
      );
      const data = await response.json();
      return data.rows;
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  getAllLeagues = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/leagues`
      );
      const data = await response.json();
      return data.rows;
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  getAllStats = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/stats/post2017`
      );
      const data = await response.json();
      this.setState({ post2017Stats: data.rows }, () => {
        this.setStatArrays();
      });
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  getSelectedPlayerStats = async (playerId, playerNumStats) => {
    let leagues = [];
    this.state.selectedLeagues.map((league) => {
      leagues.push(league.value);
    });

    leagues = leagues.join(", ");
    console.log(leagues);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/players/id?playerId=${playerId}&&leagues=${leagues}`
      );
      const data = await response.json();
      this.setAdditionalStats(data.rows);

      const joinedData = {
        ...data.rows[0],
        ...this.setAdditionalStats(data.rows[0]),
      };
      this.setState({ [playerNumStats]: joinedData });
    } catch (err) {
      console.log(err);
      this.setState({ failedFetch: true });
    }
  };

  getLeagueStats = async () => {
    if (this.state.selectedLeagues.length < 1) {
      this.setState({ competition: ["domestic", "international"] });
    }
    let leagueArray = [];
    this.state.selectedLeagues.map((league) => {
      leagueArray.push(league.value || league.league_id);
    });
    leagueArray = leagueArray.join(", ");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/stats/post2017/leagues?leagues=${leagueArray}`
      );
      const data = await response.json();
      this.setState({ post2017LeagueStats: data.rows }, () => {
        this.setStatArrays();
      });
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  getDomesticLeagues = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/stats/post2017/domestic_leagues`
      );
      const data = await response.json();
      this.setState({ domesticLeagues: data.rows });
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  getInternationalLeagues = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/stats/post2017/international_leagues`
      );
      const data = await response.json();
      this.setState({ internationalLeagues: data.rows });
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  getManOfTheMatch = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/stats/post2017/man_of_the_match`
      );
      const data = await response.json();
      this.setState({ man_of_the_match: data.rows });
    } catch (err) {
      this.setState({ failedFetch: true });
    }
  };

  setAdditionalStats = (data) => {
    console.log(data);
    let additionalStats = {};
    let num = 0;

    num = data.runs / data.dismissed;
    if (!isFinite(num)) {
      num = data.runs / data.games_played;
    }
    num = +num.toFixed(2);
    additionalStats.batting_average = num || 0;

    num = (data.runs / data.ballsfaced) * 100;
    num = +num.toFixed(2);
    additionalStats.batting_strike_rate = num || 0;

    num = (data.runs / data.ballsfaced) * 100;
    num = +num.toFixed(2);
    additionalStats.dot_ball_percentage = num || 0;

    num = data.runs_conceded / data.wickets;
    num = +num.toFixed(2);
    additionalStats.bowling_average = num || 0;

    num = (data.runs_conceded / data.balls_boweled_legal) * 6;
    num = +num.toFixed(2);
    additionalStats.bowling_economy_rate = num || 0;

    this.state.man_of_the_match.map((game) => {
      if (game.player_id === data.player_id) {
        additionalStats.man_of_the_match = game.man_of_the_match;
      }
    });

    return additionalStats;
  };

  // A click handler for the 'player type' buttons
  playerTypeClickHandler = (value) => {
    this.setState({ playerType: value });
  };

  competitionClickHandler = (e) => {
    let key = e.target.value;

    if (this.state.competition.includes(key)) {
      if (this.state.competition.length >= 2) {
        if (key === "international") {
          let domesticLeagues = [];
          this.state.domesticLeagues.map((league) => {
            domesticLeagues.push({
              value: league.league_id,
              label: league.league,
            });
          });
          this.setState({ selectedLeagues: domesticLeagues });
        }

        if (key === "domestic") {
          let internationalLeagues = [];
          this.state.internationalLeagues.map((league) => {
            internationalLeagues.push({
              value: league.league_id,
              label: league.league,
            });
          });
          this.setState({ selectedLeagues: internationalLeagues });
        }

        this.setState(
          (prevState) => ({
            competition: prevState.competition.filter((x) => x !== key),
          }),
          () => {
            this.getLeagueStats();
          }
        );
      } else {
        alert("You must have at least 1 selected competition selected");
      }
    } else {
      this.setState((prevState) => ({
        competition: [...prevState.competition, key],
        selectedLeagues: [],
      }));
    }
  };

  playerSelectClickHandler = (selectedPlayer, e) => {
    let playerNumStats = `${selectedPlayer}Stats`;

    this.setState({ [selectedPlayer]: e }, () => {
      this.getSelectedPlayerStats(e.value, playerNumStats);
    });
  };

  statCheckboxClickHandler = (e) => {
    const key = e.target.id;

    if (this.state.selectedStats.includes(key)) {
      if (this.state.selectedStats.length >= 4) {
        this.setState((prevState) => ({
          selectedStats: prevState.selectedStats.filter((x) => x !== key),
        }));
      } else {
        alert("You must have at least 3 stats selected");
      }
    } else {
      this.setState((prevState) => ({
        selectedStats: [...prevState.selectedStats, key],
      }));
    }
  };

  playerTemplateClickHandler = (e) => {
    let key = e.target.innerHTML;

    switch (key) {
      default:
        console.log("defaulted");
        break;

      case "Batsman":
        this.setState({
          selectedStats: [
            "Runs",
            "Batting Average",
            "Batting Strike Rate",
            "Fours",
            "Sixes",
            "Balls Per Boundary",
            "Power Play Strike Rate",
            "Death Strike Rate",
            "Dot Ball Percentage",
          ],
        });
        break;

      case "Bowler":
        this.setState({
          selectedStats: [
            "Wickets",
            "Bowling Average",
            "Bowling Economy Rate",
            "Catches",
            "Dot Ball Percentage",
            "Power Play Economy Rate",
            "Death Overs Economy Rate",
          ],
        });
        break;

      case "Wicket Keeper":
        this.setState({
          selectedStats: [
            "Catches",
            "Stumpings",
            "Run Outs",
            "Runs",
            "Batting Average",
            "Batting Strike Rate",
            "Fours",
            "Sixes",
            "Balls Per Boundary",
            "Power Play Strike Rate",
            "Death Strike Rate",
            "Dot Ball Percentage",
          ],
        });
        break;

      case "All Rounder":
        this.setState({
          selectedStats: [
            "Runs",
            "Batting Average",
            "Batting Strike Rate",
            "Wickets",
            "Bowling Average",
            "Bowling Economy Rate",
            "Catches",
            "Fours",
            "Sixes",
            "Balls Per Boundary",
            "Power Play Strike Rate",
            "Death Strike Rate",
            "Dot Ball Percentage",
          ],
        });
        break;
    }
  };

  leagueClickHandler = (leagues) => {
    this.setState({ selectedLeagues: leagues });
    if (!leagues) {
      this.setState({ competition: ["domestic", "international"] });
    }
  };

  // This function renders all the controls for the graph
  renderControls = () => {
    return (
      <Col sm={12} md={12} lg={3} xl={3} id="control-tabs">
        <SelectTabs
          graphType={this.state.graphType}
          action={(e) => {
            if (this.state.graphType !== e) this.setState({ graphType: e });
          }}
        />
        <PlayerSelect
          clickHandler={this.playerTypeClickHandler}
          options={this.state}
          playerSelectClickHandler={this.playerSelectClickHandler}
        />
        <Filters
          leagues={this.state.allLeagues}
          venues={this.state.allVenues}
          competition={this.state.competition}
          selectedStats={this.state.selectedStats}
          domesticLeagues={this.state.domesticLeagues}
          internationalLeagues={this.state.internationalLeagues}
          selectedLeagues={this.state.selectedLeagues}
          competitionClickHandler={this.competitionClickHandler}
          statCheckboxClickHandler={this.statCheckboxClickHandler}
          playerTemplateClickHandler={this.playerTemplateClickHandler}
          leagueClickHandler={this.leagueClickHandler}
          passStatsToState={this.passStatsToState}
          getLeagueStats={this.getLeagueStats}
        />
        {this.goButton()}
      </Col>
    );
  };

  setStatArrays = () => {
    let key = null;
    this.state.selectedLeagues.length > 0
      ? (key = this.state.post2017LeagueStats)
      : (key = this.state.post2017Stats);

    let array = [];
    let runs = [];
    let batting_average = [];
    let batting_strike_rate = [];
    let balls_per_boundary = [];
    let power_play_strike_rate = [];
    let death_strike_rate = [];
    let dot_ball_percentage = [];
    let wickets = [];
    let bowling_average = [];
    let bowling_economy_rate = [];
    let catches = [];
    let run_outs = [];
    let death_overs_economy_rate = [];
    let sixes = [];
    let power_play_economy_rate = [];
    let fours = [];
    let stumpings = [];
    let man_of_the_match = [];

    this.state.stats.map((stat) => {
      key.map((item, index) => {
        let num = 0;
        switch (stat) {
          case "Runs":
            runs.push(item.runs);
            break;

          case "Batting Average":
            num = item.runs / item.dismissed;
            if (!isFinite(num)) {
              num = item.runs / item.games_played;
            }
            num = +num.toFixed(2);
            batting_average.push(num || 0);
            break;

          case "Batting Strike Rate":
            num = (item.runs / item.ballsfaced) * 100;
            num = +num.toFixed(2);
            batting_strike_rate.push(num || 0);
            break;

          case "Balls Per Boundary":
            balls_per_boundary.push(item.balls_per_boundary);
            break;

          case "Power Play Strike Rate":
            power_play_strike_rate.push(item.power_play_strike_rate);
            break;

          case "Death Strike Rate":
            death_strike_rate.push(item.death_strike_rate);
            break;

          case "Dot Ball Percentage":
            num = (item.runs / item.ballsfaced) * 100;
            num = +num.toFixed(2);
            dot_ball_percentage.push(num || 0);
            break;

          case "Wickets":
            wickets.push(item.wickets);
            break;

          case "Bowling Average":
            num = item.runs_conceded / item.wickets;
            num = +num.toFixed(2);
            bowling_average.push(num || 0);
            break;

          case "Bowling Economy Rate":
            num = (item.runs_conceded / item.balls_boweled_legal) * 6;
            num = +num.toFixed(2);
            bowling_economy_rate.push(num || 0);
            break;

          case "Catches":
            catches.push(item.catches);
            break;

          case "Run Outs":
            run_outs.push(item.run_outs);
            break;

          case "Death Overs Economy Rate":
            death_overs_economy_rate.push(item.death_overs_economy_rate);
            break;

          case "Sixes":
            sixes.push(item.sixes);
            break;

          case "Power Play Economy Rate":
            power_play_economy_rate.push(item.power_play_economy_rate);
            break;

          case "Fours":
            fours.push(item.fours);
            break;

          case "Stumpings":
            stumpings.push(item.stumpings);
            break;

          case "Man Of The Match":
            if (index > this.state.man_of_the_match.length - 1) {
              man_of_the_match.push(0);
            } else {
              man_of_the_match.push(
                this.state.man_of_the_match[index].man_of_the_match
              );
            }
            break;
          default:
            array.push(item);
            break;
        }
      });
    });
    this.setState({
      totalStats: {
        fours: fours.sort((a, b) => {
          return a - b;
        }),
        sixes: sixes.sort((a, b) => {
          return a - b;
        }),
        balls_per_boundary: balls_per_boundary.sort((a, b) => {
          return a - b;
        }),
        batting_average: batting_average.sort((a, b) => {
          return a - b;
        }),
        batting_strike_rate: batting_strike_rate.sort((a, b) => {
          return a - b;
        }),
        bowling_average: bowling_average.sort((a, b) => {
          return a - b;
        }),
        bowling_economy_rate: bowling_economy_rate.sort((a, b) => {
          return a - b;
        }),
        catches: catches.sort((a, b) => {
          return a - b;
        }),
        death_strike_rate: death_strike_rate.sort((a, b) => {
          return a - b;
        }),
        death_overs_economy_rate: death_overs_economy_rate.sort((a, b) => {
          return a - b;
        }),
        dot_ball_percentage: dot_ball_percentage.sort((a, b) => {
          return a - b;
        }),
        power_play_economy_rate: power_play_economy_rate.sort((a, b) => {
          return a - b;
        }),
        power_play_strike_rate: power_play_strike_rate.sort((a, b) => {
          return a - b;
        }),
        run_outs: run_outs.sort((a, b) => {
          return a - b;
        }),
        runs: runs.sort((a, b) => {
          return a - b;
        }),
        stumpings: stumpings.sort((a, b) => {
          return a - b;
        }),
        wickets: wickets.sort((a, b) => {
          return a - b;
        }),
        man_of_the_match: man_of_the_match.sort((a, b) => {
          return a - b;
        }),
      },
    });
  };

  passStatsToState = (stats) => {
    this.setState({ stats });
  };

  findPercentile = () => {
    let player1Percentiles = [];
    let player2Percentiles = [];
    const percentile = (arr, val) =>
      (100 *
        arr.reduce(
          (acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0),
          0
        )) /
      arr.length;

    this.state.selectedStats.map((stat) => {
      let newStat = stat.split(" ").join("_").toLowerCase();

      if (this.state.player1Stats[newStat] > 0) {
        player1Percentiles.push(
          Math.round(
            percentile(
              this.state.totalStats[newStat],
              this.state.player1Stats[newStat]
            )
          )
        );
      } else {
        player1Percentiles.push(0);
      }
      if (this.state.player2Stats[newStat] > 0) {
        player2Percentiles.push(
          Math.round(
            percentile(
              this.state.totalStats[newStat],
              this.state.player2Stats[newStat]
            )
          )
        );
      } else {
        player2Percentiles.push(0);
      }
    });

    this.setState({ player1Percentiles, player2Percentiles }, () => {
      this.setRadarData();
    });
  };

  setRadarData = () => {
    let data = [];
    this.state.selectedStats.map((stat, index) => {
      data.push({
        stat: stat,
        [this.state.player1.label]: this.state.player1Percentiles[index],
        [this.state.player2.label]: this.state.player2Percentiles[index],
      });

      this.setState({ radarChartData: data });
    });
  };

  goButton = () => {
    return (
      <button
        onClick={() => {
          this.findPercentile();
        }}
      >
        Go
      </button>
    );
  };

  render() {
    return this.renderPage();
  }
}

export default Home;
