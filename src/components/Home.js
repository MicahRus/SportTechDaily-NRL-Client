import React from "react";
import { Redirect } from "react-router-dom";

import logo from "./images/logo.svg";

import {
  Form,
  Col,
  Row,
  Tab,
  Tabs,
  Button,
  Table,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";

import RangeSlider from "react-bootstrap-range-slider";

import Select from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ResponsiveRadar } from "@nivo/radar";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { ResponsiveBar } from "@nivo/bar";

import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

const saveSvgAsPng = require("save-svg-as-png");

class Home extends React.Component {
  state = {
    visibility: null,
    averageOrTotal: "average",
    playerPercentiles: [{}, {}],
    scatterStat1: ["All Run Metres"],
    scatterStat2: ["Fantasy Points Total"],
    initialDisable: true,
    selectedStats: [
      "all_run_metres",
      "errors",
      "tries",
      "try_assists",
      "tackle_breaks",
      "line_breaks",
    ],
    stats: [{ kicks: 0 }, { passes: 0 }],
    barStat1: ["All Run Metres"],
    currentPlayers: [],
    checked: true,
    year: 2020,
    templateChecked: true,
    selectedPlayers: [
      { value: "500663", label: "James Tedesco" },
      { value: "504870", label: "Kalyn Ponga" },
    ],
    value: 5,
    players: [],
    graphType: "radar",
    redirect: null,
    showPositionButtons: false,
    startDate: { date: Date.now() },
    endDate: { date: new Date() },
    disabled: false,
    fanType: "general",
    playerOrTeam: "player",
    teams: ["test"],
    toggleAdvancedOptions: false,
    enableDotLabel: false,
    barGraphData: [
      { playerName: "James Tedesco", ["All Run Metres"]: 98 },
      { playerName: "Kalyn Ponga", ["All Run Metres"]: 95 },
    ],
    currentPlayersData: {
      player1: { data: null, playerName: "player1" },
      player2: { data: null, playerName: "player2" },
    },
    graphData: [
      {
        stat: "all_run_metres",
        player1: 51,
        player2: 80,
      },
      {
        stat: "errors",
        player1: 99,
        player2: 75,
      },
      {
        stat: "line_breaks",
        player1: 99,
        player2: 75,
      },
      {
        stat: "tries",
        player1: 99,
        player2: 75,
      },
      {
        stat: "tackle_breaks",
        player1: 99,
        player2: 75,
      },
      {
        stat: "try_assists",
        player1: 99,
        player2: 75,
      },
    ],
    options: [
      { label: "All Run Metres", value: "All Run Metres" },
      { label: "Conversions", value: "Conversions" },
      { label: "Errors", value: "Errors" },
      { label: "Fantasy Points", value: "Fantasy Points Total" },
      { label: "Field Goals", value: "Field Goals" },
      { label: "Intercepts", value: "Intercepts" },
      { label: "Kick Metres", value: "Kick Metres" },
      { label: "Line Break Assists", value: "Line Break Assists" },
      { label: "Line Breaks", value: "Line Breaks" },
      { label: "Minutes Played", value: "Minutes Played" },
      { label: "Missed Tackles", value: "Missed Tackles" },
      { label: "Offloads", value: "Offloads" },
      { label: "One On One Steal", value: "One On One Steal" },
      { label: "Post Contact Metres", value: "Post Contact Metres" },
      { label: "Tackle Breaks", value: "Tackle Breaks" },
      { label: "Tackle Efficiency", value: "Tackle Efficiency" },
      { label: "Tackles Made", value: "Tackles Made" },
      { label: "Tries", value: "Tries" },
      { label: "Try Assists", value: "Try Assists" },
    ],
  };

  componentDidMount() {
    this.getSeasonPlayerPercentilesAverage();
    this.getSeasonPlayerPercentilesTotal();
    this.getPlayerAveragePercentiles();
    this.getSeasonPlayerStatsAverage();
    this.getSeasonPlayerStatsTotal();
    this.getCurrentMatches();
    this.getAllPlayersData();
    this.getAllTeamsData();
    this.getCurrentPlayers();
    this.getPlayerPercentiles();
    // this.getCurrentStats();
    this.setDelay();
  }

  getCurrentMatches = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/current_matches`
    );
    const data = await response.json();
    this.setState({ currentMatches: data.rows });
  };

  getSeasonPlayerStatsAverage = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/season/player/stats/average`
    );
    const data = await response.json();
    this.setState({ seasonPlayerStatsAverage: data.rows });
  };

  getSeasonPlayerStatsTotal = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/season/player/stats/total`
    );
    const data = await response.json();
    this.setState({ seasonPlayerStatsTotal: data.rows });
  };

  getSeasonPlayerPercentilesTotal = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/season/player/percentile/total`
    );
    const data = await response.json();
    this.setState({ seasonPlayerPercentilesTotal: data.rows });
  };

  getSeasonPlayerPercentilesAverage = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/season/player/percentile/average`
    );
    const data = await response.json();
    this.setState({ seasonPlayerPercentilesAverage: data.rows });
  };

  getPlayerAveragePercentiles = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/average_percentiles`
    );
    const data = await response.json();
    this.setState({ averagePlayerPercentiles: data.rows });
  };

  getPlayerPercentiles = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/percentiles`
    );
    const data = await response.json();
    this.setState({ playerPercentiles: data.rows });
  };

  // getCurrentStats = async () => {
  //   const response = await fetch(
  //     `${process.env.REACT_APP_BACKEND_URL}/currentstats`
  //   );
  //   const data = await response.json();

  // };

  getMatches = async (playerId, playerName, playerNumber) => {
    let playerId1 = playerId;
    let playerId2 = null;
    let selectedPlayers = JSON.parse(
      JSON.stringify(this.state.selectedPlayers)
    );

    if (playerNumber === "player1") {
      playerId2 = this.state.selectedPlayers[1].value;
      selectedPlayers[0].value = playerId;
      selectedPlayers[0].label = playerName;
    } else {
      playerId2 = this.state.selectedPlayers[0].value;
      selectedPlayers[1].value = playerId;
      selectedPlayers[1].label = playerName;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/matches?playerId1=${playerId1}&playerId2=${playerId2}`
    );
    const data = await response.json();
    let player1Matches = [];
    let player2Matches = [];
    data.rows.map((match) => {
      this.state.currentMatches.map((currentMatch) => {
        if (currentMatch.match_id === match.match_id) {
          if (match.player_id === playerId1) {
            player1Matches.push(match);
          } else {
            player2Matches.push(match);
          }
        }
        return null;
      });
      return null;
    });

    this.setState({ player1Matches, player2Matches, selectedPlayers });
    this.setScatterChartData();
  };

  getAllPlayersData = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/players`
    );
    const data = await response.json();
    this.setState({ players: data.rows });
  };

  getCurrentPlayers = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/currentplayers`
    );
    const data = await response.json();

    this.setState({
      currentPlayers: data.rows,
    });

    this.setStats();
    this.getMatches("500663", "James Tedesco", "player1");
    this.getMatches("504870", "Kalyn Ponga", "player2");
  };

  // Pushes all the stats from the player data into an array, and then sets it to state.
  setStats = () => {
    const stats = [
      "all_run_metres",
      "conversions",
      "errors",
      "fantasy_points_total",
      "field_goals",
      "intercepts",
      "kick_metres",
      "line_break_assists",
      "line_breaks",
      "minutes_played",
      "missed_tackles",
      "offloads",
      "one_on_one_steal",
      "post_contact_metres",
      "tackle_breaks",
      "tackle_efficiency",
      "tackles_made",
      "tries",
      "try_assists",
    ];

    let all_run_metres = [];
    let conversions = [];
    let errors = [];
    let fantasy_points_total = [];
    let field_goals = [];
    let intercepts = [];
    let kick_metres = [];
    let line_break_assists = [];
    let line_breaks = [];
    let minutes_played = [];
    let missed_tackles = [];
    let offloads = [];
    let one_on_one_steal = [];
    let post_contact_metres = [];
    let tackle_breaks = [];
    let tackle_efficiency = [];
    let tackles_made = [];
    let tries = [];
    let try_assists = [];
    this.state.currentPlayers.map((player) => {
      stats.map((stat) => {
        switch (stat) {
          default:
            all_run_metres.push(player[stat]);
            break;
          case "conversions":
            conversions.push(player[stat]);
            break;
          case "errors":
            errors.push(player[stat]);
            break;
          case "fantasy_points_total":
            fantasy_points_total.push(player[stat]);
            break;
          case "field_goals":
            field_goals.push(player[stat]);
            break;
          case "intercepts":
            intercepts.push(player[stat]);
            break;
          case "kick_metres":
            kick_metres.push(player[stat]);
            break;
          case "line_break_assists":
            line_break_assists.push(player[stat]);
            break;
          case "line_breaks":
            line_breaks.push(player[stat]);
            break;
          case "minutes_played":
            minutes_played.push(player[stat]);
            break;
          case "missed_tackles":
            missed_tackles.push(player[stat]);
            break;
          case "offloads":
            offloads.push(player[stat]);
            break;
          case "one_on_one_steal":
            one_on_one_steal.push(player[stat]);
            break;
          case "post_contact_metres":
            post_contact_metres.push(player[stat]);
            break;
          case "tackle_breaks":
            tackle_breaks.push(player[stat]);
            break;
          case "tackle_efficiency":
            tackle_efficiency.push(player[stat]);
            break;
          case "tackles_made":
            tackles_made.push(player[stat]);
            break;
          case "tries":
            tries.push(player[stat]);
            break;
          case "try_assists":
            try_assists.push(player[stat]);
            break;
        }
        return null;
      });
      return null;
    });
    const allStats = [
      { all_run_metres },
      { conversions },
      { errors },
      { fantasy_points_total },
      { field_goals },
      { intercepts },
      { kick_metres },
      { line_break_assists },
      { line_breaks },
      { minutes_played },
      { missed_tackles },
      { offloads },
      { one_on_one_steal },
      { post_contact_metres },
      { tackle_breaks },
      { tackle_efficiency },
      { tackles_made },
      { tries },
      { try_assists },
    ];
    this.setState({ stats: allStats });

    // This will get the 2 'Template players' we want to display
    this.getPlayerData("500663", "James Tedesco", "player1");
    this.getPlayerData("504870", "Kalyn Ponga", "player2");
  };

  // Retrieves individual player data from the database
  getPlayerData = async (playerId, playerName, playerNumber) => {
    playerId = parseInt(playerId);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/player/id?playerId=${playerId}`
    );
    const data = await response.json();

    // Sets the state if the player number is 1
    if (playerNumber === "player1") {
      let player2 = this.state.currentPlayersData.player2;
      this.setState({
        currentPlayersData: {
          player1: { data: data.rows, playerName: playerName },
          player2: { data: player2.data, playerName: player2.playerName },
        },
      });
    }

    // Sets the state if the player number is 2
    if (playerNumber === "player2") {
      let player1 = this.state.currentPlayersData.player1;
      this.setState({
        currentPlayersData: {
          player1: { data: player1.data, playerName: player1.playerName },
          player2: { data: data.rows, playerName: playerName },
        },
      });
    }

    this.setGraphData(playerName, playerNumber);
  };

  getAllTeamsData = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/teams`);
    const data = await response.json();
    this.setState({ teams: data.rows });
  };

  componentDidUpdate() {
    console.log(this.state);
    if (this.state.refreshBarChart) {
      this.setBarChartData(this.state.selectedPlayers);
    }
  }

  handleRefresh = () => {
    if (this.state.getNewPlayer1Data) {
      this.setGraphData(
        [this.state.currentPlayersData.player1.playerName],
        "player1"
      );
      this.setState({ getNewPlayer1Data: false, getNewPlayer2Data: true });
    }
    if (this.state.getNewPlayer2Data) {
      this.setGraphData(
        [this.state.currentPlayersData.player2.playerName],
        "player2"
      );
      this.setState({ getNewPlayer2Data: false });
    }

    if (!this.state.getNewPlayer1Data && !this.state.getNewPlayer2Data) {
      this.setState({ redirect: null });
    }
  };

  // This function handles setting up the data that the  radar graph will display
  setGraphData = (playerName, playerNumber) => {
    let playerStat = 1;
    let seasonStats = null;
    let newData = [];
    let x = null;

    // A function that will select the stats being compared and then find the percentile of them and pass that data to state
    this.state.selectedStats.map((stat, i) => {
      let keys = Object.keys(this.state.graphData[i]);
      let values = Object.values(this.state.graphData[i]);

      // let values = [this.state.graphData[i].stat];

      // Selects the stat which is being compared
      switch (stat) {
        default:
          x = 0;
          break;
        case "conversions":
          x = 1;
          break;
        case "errors":
          x = 2;
          break;
        case "fantasy_points_total":
          x = 3;
          break;
        case "field_goals":
          x = 4;
          break;
        case "intercepts":
          x = 5;
          break;
        case "kick_metres":
          x = 6;
          break;
        case "line_break_assists":
          x = 7;
          break;
        case "line_breaks":
          x = 8;
          break;
        case "minutes_played":
          x = 9;
          break;
        case "missed_tackles":
          x = 10;
          break;
        case "offloads":
          x = 11;
          break;
        case "one_on_one_steal":
          x = 12;
          break;
        case "post_contact_metres":
          x = 13;
          break;
        case "tackle_breaks":
          x = 14;
          break;
        case "tackle_efficiency":
          x = 15;
          break;
        case "tackles_made":
          x = 16;
          break;
        case "tries":
          x = 17;
          break;
        case "try_assists":
          x = 18;
          break;
      }

      // Checks the see if the function should work with the total or average stats
      if (this.state.averageOrTotal === "total") {
        seasonStats = this.state.seasonPlayerPercentilesTotal;
      } else {
        seasonStats = this.state.seasonPlayerPercentilesAverage;
      }

      seasonStats.map((player) => {
        if (
          player.player_name === playerName[0] ||
          player.player_name === playerName
        ) {
          playerStat =
            player[
              this.state.options[x].value.toLowerCase().split(" ").join("_")
            ];
        }
        return null;
      });
      if (playerNumber === "player1") {
        newData.push({
          stat: this.state.options[x].value,
          [playerName]: playerStat,
          [keys[2]]: values[2],
        });
      } else {
        newData.push({
          stat: this.state.options[x].value,
          [keys[1]]: values[1],
          [playerName]: playerStat,
        });
      }
      return null;
    });
    this.setState({ graphData: newData, redirect: "/" });
  };

  toggleAdvancedOptions = () => {
    this.setState({
      toggleAdvancedOptions: !this.state.toggleAdvancedOptions,
    });
  };

  playerButtonSelectHandler1 = (event) => {
    let playerId = event.value;
    let playerName = event.label;
    let playerNumber = "player1";
    if (this.state.graphType === "scatter") {
      this.getMatches(playerId, playerName, playerNumber);
    } else {
      this.getPlayerData(playerId, playerName, playerNumber);
    }
    this.setState({ scatterPlayer1: playerName });
  };

  playerButtonSelectHandler2 = (event) => {
    let playerId = event.value;
    let playerName = event.label;
    let playerNumber = "player2";

    if (this.state.graphType === "scatter") {
      this.getMatches(playerId, playerName, playerNumber);
    } else {
      this.getPlayerData(playerId, playerName, playerNumber);
    }
    this.setState({ scatterPlayer2: playerName });
  };

  statCheckBoxChangeHandler = (event) => {
    let key = event.target.id;

    if (this.state.selectedStats.includes(key)) {
      let filteredArray = this.state.selectedStats.filter(
        (item) => item !== key
      );
      // This will prevent the user from selecting down to less than 3 stats
      if (this.state.selectedStats.length <= 3) {
        alert("you must have at least 3 stats selected");
      } else {
        this.setState({ selectedStats: filteredArray });
      }
    } else {
      this.setState((prevState) => ({
        selectedStats: [...prevState.selectedStats, key],
      }));
    }
    // Deep clones an array from state
    let clonedArray = JSON.parse(JSON.stringify(this.state.graphData));
    let counter = 0;

    // This will handle setting the graph data variables when we want to remove checkboxes
    clonedArray.map((item, i) => {
      if (item.stat === key) {
        clonedArray.splice(i, 1);
      } else {
        if (item.stat !== key) {
          counter++;
        }
        if (counter === clonedArray.length) {
          clonedArray.push({
            stat: key,
            [this.state.currentPlayersData.player1.playerName]: 5,
            [this.state.currentPlayersData.player2.playerName]: 10,
          });
        }
      }
      return null;
    });
    this.setState({
      graphData: clonedArray,
      redirect: "/",
      getNewPlayer1Data: true,
    });
  };

  renderPlayerSelect = () => {
    const playerOptions = [];
    this.state.currentPlayers.map((player) => {
      playerOptions.push({
        value: player.player_id,
        label: player.player_name,
      });
      return null;
    });

    return (
      <div>
        <span> Players</span>
        <Select
          isMulti
          closeMenuOnSelect={false}
          name="players"
          options={playerOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          value={this.state.selectedPlayers}
          onChange={(players) => {
            console.log(players.length);
            console.log(players);
            if (players.length <= 5) {
              this.setBarChartData(players);
            } else {
              alert("You have selected the max amount of players(5)");
            }
          }}
        />
      </div>
    );
  };

  setScatterChartData = () => {
    let maxGamesPlayed = null;
    let player1Data = [];
    let player2Data = [];
    let player1Name = null;
    let player2Name = null;

    this.state.players.map((player) => {
      if (player.player_id === this.state.player1Matches[0].player_id) {
        player1Name = player.first_name + " " + player.last_name;
      }
      if (player.player_id === this.state.player2Matches[0].player_id) {
        player2Name = player.first_name + " " + player.last_name;
      }
      return null;
    });
    let stat1 = this.state.scatterStat1[0].toLowerCase().split(" ").join("_");
    let stat2 = this.state.scatterStat2[0].toLowerCase().split(" ").join("_");

    if (this.state.player1Matches.length > this.state.player2Matches.length) {
      maxGamesPlayed = this.state.player2Matches.length;
    } else {
      maxGamesPlayed = this.state.player1Matches.length;
    }

    for (let i = 0; i < maxGamesPlayed - 1; i++) {
      player1Data.push({
        x: this.state.player1Matches[i][stat1],
        y: this.state.player1Matches[i][stat2],
      });
      player2Data.push({
        x: this.state.player2Matches[i][stat1],
        y: this.state.player2Matches[i][stat2],
      });
    }

    let player1MatchDates = [];
    let player2MatchDates = [];
    // This will pass the round number / match date of the players matches to be used in the scatter graph
    this.state.currentMatches.map((match) => {
      this.state.player1Matches.map((playerMatch) => {
        if (match.match_id === playerMatch.match_id) {
          player1MatchDates.push(match);
        }
        return null;
      });
      this.state.player2Matches.map((playerMatch) => {
        if (match.match_id === playerMatch.match_id) {
          player2MatchDates.push(match);
        }
        return null;
      });
      return null;
    });

    this.setState({
      scatterGraphData: [
        {
          id: player1Name,
          data: player1Data,
        },
        {
          id: player2Name,
          data: player2Data,
        },
      ],
      player1MatchDates,
      player2MatchDates,
    });
    return null;
  };

  setBarChartData = (players) => {
    const graphData = [];
    let stat = this.state.barStat1[0];
    let lowerStat = stat.split(" ").join("_").toLowerCase();
    players.map((player) => {
      if (this.state.averageOrTotal === "total") {
        this.state.seasonPlayerPercentilesTotal.map((percentile) => {
          if (player.value === percentile.player_id) {
            graphData.push({
              playerName: player.label,
              [stat]: percentile[lowerStat],
            });
          }
          return null;
        });
      } else {
        this.state.seasonPlayerPercentilesAverage.map((percentile) => {
          if (player.value === percentile.player_id) {
            graphData.push({
              playerName: player.label,
              [stat]: percentile[lowerStat],
            });
          }
          return null;
        });
      }
      return null;
    });
    this.setState({
      barGraphData: graphData,
      selectedPlayers: players,
      refreshBarChart: false,
    });
    return null;
  };

  renderBarChart = () => {
    let stat = this.state.barStat1[0];
    let lowerStat = stat[0].toLowerCase().split(" ").join("_");
    return (
      <Col lg={8} sm={12}>
        <div className="graph-container" style={{ height: "80%" }}>
          <ResponsiveBar
            data={this.state.barGraphData}
            layout="horizontal"
            keys={[stat]}
            indexBy="playerName"
            margin={{ top: 50, right: 120, bottom: 50, left: 120 }}
            padding={0.8}
            colors={{ scheme: "set1" }}
            maxValue={100}
            minValue={0}
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "#38bcb2",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "#eed312",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: [this.state.barStat1],
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: null,
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
        {this.downloadButton()}
      </Col>
    );
  };

  // Renders the scatter-plot graph
  renderScatterPlot = () => {
    let stat1 = this.state.scatterStat1;
    let stat2 = this.state.scatterStat2;

    let x = -1;
    let player1Matches = this.state.player1MatchDates;
    return (
      <Col lg={8} sm={12} className="graph-container">
        <div style={{ height: "80%" }}>
          <h1 style={{ textAlign: "center" }}>
            {" "}
            {stat1} v {stat2}
          </h1>
          <ResponsiveScatterPlot
            colors={{ scheme: "set1" }}
            data={this.state.scatterGraphData || null}
            margin={{ top: 60, right: 150, bottom: 80, left: 90 }}
            xScale={{ type: "linear", min: "auto", max: "auto" }}
            xFormat={function (e) {
              return `${e}`;
            }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            yFormat={function (e) {
              if (x < player1Matches.length - 1) x++;
              return ` ${e} - ${player1Matches[x].round_name}, ${
                player1Matches[x].match_date.split("T")[0]
              }`;
            }}
            blendMode="multiply"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: "bottom",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 90,
              legend: `${stat1} (x)`,
              legendPosition: "middle",
              legendOffset: 46,
            }}
            axisLeft={{
              orient: "left",
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: `${stat2} (y)`,
              legendPosition: "middle",
              legendOffset: -60,
            }}
            legends={[
              {
                anchor: "bottom-left",
                direction: "column",
                justify: false,
                translateX: -100,
                translateY: -15,
                itemWidth: 100,
                itemHeight: 15,
                itemsSpacing: 20,
                itemDirection: "top-to-bottom",
                symbolSize: 12,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </Col>
    );
  };

  downloadHandler = async () => {
    const imageOptions = {
      scale: 5,
      encoderOptions: 1,
      backgroundColor: "white",
    };

    const allSvg = document.querySelectorAll("svg");
    const svg = allSvg[allSvg.length - 1];

    console.log(allSvg);

    (() => {
      const svgImg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image"
      );
      svgImg.setAttributeNS(null, "height", "18%");
      svgImg.setAttributeNS(null, "width", "18%");
      svgImg.setAttributeNS("http://www.w3.org/1999/xlink", "href", logo);
      svgImg.setAttributeNS(null, "x", "75%");
      svgImg.setAttributeNS(null, "y", "0%");
      svgImg.setAttributeNS(null, "visibility", "visible");
      svgImg.setAttributeNS(null, "id", "logo");
      svg.append(svgImg);

      const getLogo = document.getElementById("logo");

      saveSvgAsPng.saveSvgAsPng(svg, "sportTechDaily_graph.png", imageOptions);

      setTimeout(() => {
        getLogo.remove();
        this.setState({ enableDotLabel: false });
      }, 1000);
    })();
  };

  downloadButton = () => {
    return (
      <Button
        onClick={this.downloadHandler}
        variant="secondary"
        size="sm"
        active
      >
        Download
      </Button>
    );
  };

  // Renders the radar graph
  renderRadar = () => {
    return (
      <Col sm={12} lg={8} md={8} xl={8}>
        <div className="graph-container">
          <ResponsiveRadar
            id="radarGraph"
            data={this.state.graphData}
            keys={[
              this.state.currentPlayersData?.player1.playerName,
              this.state.currentPlayersData?.player2.playerName,
            ]}
            indexBy="stat"
            maxValue="99"
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            curve="linearClosed"
            borderWidth={2}
            borderColor={{ from: "color" }}
            gridLevels={5}
            gridShape="linear"
            gridLabelOffset={16}
            enableDots={true}
            dotSize={6}
            dotColor={{ theme: "background" }}
            dotBorderWidth={1.5}
            dotBorderColor={{ from: "color" }}
            enableDotLabel={this.state.enableDotLabel}
            dotLabel="value"
            dotLabelYOffset={10}
            colors={{ scheme: "set1" }}
            fillOpacity={0.6}
            blendMode="multiply"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            isInteractive={true}
            legends={[
              {
                anchor: "top-left",
                direction: "column",
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: "#999",
                symbolSize: 12,
                symbolShape: "circle",
              },
            ]}
          />
        </div>
        {this.downloadButton()}
      </Col>
    );
  };

  renderAdvancedOptions = () => {
    if (this.state.toggleAdvancedOptions) {
      return (
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={this.toggleAdvancedOptions}
          >
            {" "}
            Advanced Options
          </Button>
          <form>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
            <label>
              <input type="radio" value="null" />
              Button
            </label>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={this.toggleAdvancedOptions}
          >
            {" "}
            Advanced Options
          </Button>
        </div>
      );
    }
  };

  checkStatTemplate = (type) => {
    let arr = [];
    if (type === "forward") {
      arr = [
        "all_run_metres",
        "errors",
        "tackle_breaks",
        "offloads",
        "post_contact_metres",
        "tackle_efficiency",
      ];
    } else {
      arr = [
        "all_run_metres",
        "errors",
        "line_breaks",
        "tackle_breaks",
        "tries",
        "try_assists",
      ];
    }

    arr = arr.sort();
    let y = JSON.parse(JSON.stringify(this.state.selectedStats));
    let x = y.sort();

    if (x.length > arr.length) {
      return null;
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (x[i] !== arr[i]) {
          return false;
        }
      }
      return true;
    }
  };

  renderStatTemplates = () => {
    return (
      <div>
        <Form>
          <Form.Check
            disabled={true}
            inline
            onChange={() => {
              this.setState({
                selectedStats: [
                  "all_run_metres",
                  "errors",
                  "tackle_breaks",
                  "offloads",
                  "post_contact_metres",
                  "tackle_efficiency",
                ],
              });
            }}
            type="checkbox"
            checked={this.checkStatTemplate("forward")}
            id="forward-checkbox"
            label="Forward"
          ></Form.Check>
          <Form.Check
            disabled={true}
            onChange={() => {
              this.setState({
                selectedStats: [
                  "all_run_metres",
                  "errors",
                  "line_breaks",
                  "tackle_breaks",
                  "tries",
                  "try_assists",
                ],
              });
            }}
            inline
            type="checkbox"
            id="backs-checkbox"
            checked={this.checkStatTemplate("back")}
            label="Backs"
          ></Form.Check>
        </Form>
      </div>
    );
  };

  // Contains the buttons for the fan type and the team/player buttons
  renderPlayerAndTeamTabs = () => {
    return (
      <div>
        <Tabs
          defaultActiveKey="player"
          id="teamOrPlayerSelector"
          onSelect={(e) => {
            if (this.state.playerOrTeam !== e)
              this.setState({ playerOrTeam: e });
          }}
        >
          <Tab eventKey="player" title="Player"></Tab>
          <Tab disabled={true} eventKey="team" title="Team"></Tab>
        </Tabs>
      </div>
    );
  };

  renderPositionToggle = () => {
    if (this.state.showPositionButtons) {
      return (
        <div style={{ visibility: this.state.visibility }}>
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="positions"
              onChange={() => {
                this.setState({
                  showPositionButtons: !this.state.showPositionButtons,
                });
              }}
            />
          </Form>
          <Form>
            <Row>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="2nd Row" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Five-Eighth" />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Interchange" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Hooker" />
              </Col>
            </Row>

            <Row>
              {" "}
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Fullback" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Halfback" />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Lock" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Prop" />
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Winger" />
              </Col>
              <Col>
                <Form.Check type="checkbox" id="checkbox" label="Center" />
              </Col>
            </Row>
          </Form>
        </div>
      );
    }
    return (
      <div style={{ visibility: this.state.visibility }}>
        <Form>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Positions"
            onChange={() => {
              this.setState({
                showPositionButtons: !this.state.showPositionButtons,
              });
            }}
          />
        </Form>
      </div>
    );
  };

  renderStatDropDowns = () => {
    if (this.state.graphType === "bar" || this.state.graphType === "rankings") {
      return (
        <div>
          <span> Stat</span>
          <Select
            options={this.state.options}
            onChange={(e) => {
              this.setState({
                barStat1: [e.value],
                refreshBarChart: true,
              });
            }}
            placeholder={this.state.barStat1[0]}
          />
        </div>
      );
    }
    return (
      <div>
        <span> Stat 1 </span>
        <Select
          options={this.state.options}
          onChange={(e) => {
            this.setState(
              {
                scatterStat1: [e.value],
              },
              this.setScatterChartData
            );
          }}
          placeholder={this.state.scatterStat1[0]}
          isOptionDisabled={(option) =>
            option.label === this.state.scatterStat1[0] ||
            option.label === this.state.scatterStat2[0] ||
            `${option.label} Total` === this.state.scatterStat2[0]
          }
        />
        <span>Stat 2</span>
        <Select
          options={this.state.options}
          onChange={(e) => {
            this.setState(
              {
                scatterStat2: [e.value],
              },
              this.setScatterChartData
            );
          }}
          placeholder={this.state.scatterStat2[0]}
          isOptionDisabled={(option) =>
            option.label === this.state.scatterStat1[0] ||
            option.label === this.state.scatterStat2[0]
          }
        />
      </div>
    );
  };

  renderTeamDropDown = () => {
    const options = [];
    this.state.teams.map((team) => {
      options.push({ label: team.team_name, value: team.team_name });
      return null;
    });
    return (
      <div>
        <span> Team 1 </span>
        <Select
          options={options}
          onMenuOpen={() => this.setState({ visibility: "hidden" })}
          onMenuClose={() => this.setState({ visibility: null })}
        />
        <span> Team 2 </span>
        <Select
          options={options}
          onMenuOpen={() => this.setState({ visibility: "hidden" })}
          onMenuClose={() => this.setState({ visibility: null })}
        />
      </div>
    );
  };

  renderPlayerDropDowns = () => {
    const options = [];
    this.state.currentPlayers.map((player) => {
      options.push({
        value: player.player_id,
        label: player.player_name,
      });
      return null;
    });
    if (this.state.graphType === "radar") {
      return (
        <div>
          <span> Player 1 </span>
          <Select
            options={options}
            isOptionDisabled={(option) =>
              option.label ===
                this.state.currentPlayersData.player1.playerName ||
              option.label === this.state.currentPlayersData.player2.playerName
            }
            onChange={this.playerButtonSelectHandler1}
            placeholder={this.state.currentPlayersData.player1.playerName}
          />
          <span> Player 2 </span>
          <Select
            options={options}
            isOptionDisabled={(option) =>
              option.label ===
                this.state.currentPlayersData.player1.playerName ||
              option.label === this.state.currentPlayersData.player2.playerName
            }
            onChange={this.playerButtonSelectHandler2}
            placeholder={this.state.currentPlayersData.player2.playerName}
          />
        </div>
      );
    } else {
      return (
        <div>
          <span> Player 1 </span>
          <Select
            options={options}
            onChange={this.playerButtonSelectHandler1}
            placeholder={this.state.scatterPlayer1 || "James Tedesco"}
            isOptionDisabled={(option) =>
              option.label === this.state.scatterPlayer1 ||
              option.label === this.state.scatterPlayer2
            }
          />
          <span> Player 2 </span>
          <Select
            options={options}
            onChange={this.playerButtonSelectHandler2}
            placeholder={this.state.scatterPlayer2 || "Kalyn Ponga"}
            isOptionDisabled={(option) =>
              option.label === this.state.scatterPlayer1 ||
              option.label === this.state.scatterPlayer2
            }
          />
        </div>
      );
    }
  };

  renderSingleStat = (number) => {
    return this.state.options[number].value.toLowerCase().split(" ").join("_");
  };

  // This is used to set an initial delay on the page, so the buttons are disabled until the page properly renders
  setDelay = () => {
    setTimeout(() => {
      this.setState({ initialDisable: false });
    }, 4000);
  };

  renderStatCheckBox = () => {
    return (
      <Form>
        <Form.Row className="align-items-center">
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(0)}
              label={this.state.options[0].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(0)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(1)}
              label={this.state.options[1].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(1)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(2)}
              label={this.state.options[2].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(2)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(3)}
              label={this.state.options[3].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(3)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(4)}
              label={this.state.options[4].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(4)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(5)}
              label={this.state.options[5].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(5)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(6)}
              label={this.state.options[6].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(6)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(7)}
              label={this.state.options[7].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(7)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(8)}
              label={this.state.options[8].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(8)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(9)}
              label={this.state.options[9].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(9)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(10)}
              label={this.state.options[10].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(10)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(11)}
              label={this.state.options[11].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(11)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(12)}
              label={this.state.options[12].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(12)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(13)}
              label={this.state.options[13].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(13)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(14)}
              label={this.state.options[14].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(14)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(15)}
              label={this.state.options[15].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(15)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>

        <Form.Row>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(16)}
              label={this.state.options[16].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(16)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(17)}
              label={this.state.options[17].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(17)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>
        <Form.Row>
          <Col>
            <Form.Check
              onChange={this.statCheckBoxChangeHandler}
              type="checkbox"
              id={this.renderSingleStat(18)}
              label={this.state.options[18].label}
              checked={this.state.selectedStats.includes(
                this.renderSingleStat(18)
              )}
              disabled={this.state.initialDisable}
            />
          </Col>
        </Form.Row>
      </Form>
    );
  };

  renderDateButtons = () => {
    return (
      <div>
        <Form>
          <p> Start Date </p>
          <DatePicker
            disabled={true}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            selected={this.state.startDate.date}
            onChange={(date) => this.setState({ startDate: { date: date } })}
            maxDate={Date.now()}
          />
          <br></br>
          <br></br>
          <p> End Date </p>
          <DatePicker
            disabled={true}
            dateFormat="dd/MM/yyyy"
            showYearDropdown
            selected={this.state.endDate.date}
            onChange={(date) => this.setState({ endDate: { date: date } })}
            maxDate={Date.now()}
          />
        </Form>
      </div>
    );
  };

  renderVenueSelect = () => {
    const options = [
      { value: "Suncorp Stadium", label: "Suncorp Stadium" },
      { value: "GIO Stadium	", label: "	GIO Stadium" },
      { value: "AAMI Park", label: "AAMI Park" },
    ];
    return (
      <div>
        <Select
          defaultValue={options}
          isMulti
          closeMenuOnSelect={false}
          name="venues"
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    );
  };

  renderGraphTabs = () => {
    return (
      <Row>
        <Col lg={12} sm={12} id="graph-tabs">
          <Tabs
            defaultActiveKey={this.state.graphType}
            id="graphTypeSelector"
            onSelect={(e) => {
              if (this.state.graphType !== e) this.setState({ graphType: e });
            }}
          >
            <Tab
              eventKey="radar"
              title="Radar"
              disabled={this.state.initialDisable}
            ></Tab>
            <Tab
              eventKey="scatter"
              title="Scatter"
              disabled={this.state.initialDisable}
            ></Tab>
            <Tab
              eventKey="bar"
              title="Bar"
              disabled={this.state.initialDisable}
            ></Tab>
            <Tab
              eventKey="rankings"
              title="Rankings"
              disabled={this.state.initialDisable}
            ></Tab>
            {/* <Tab eventKey="information" title="i"></Tab> */}
          </Tabs>
        </Col>
      </Row>
    );
  };

  renderMinimumGamesPlayed = () => {
    return (
      <div>
        <span> Minimum games played</span>
        <RangeSlider
          min={0}
          max={10}
          value={this.state.value}
          onChange={(changeEvent) => {
            this.setState({ value: changeEvent.target.value });
          }}
        />
      </div>
    );
  };

  renderPopover = () => {
    const popover = (
      <Popover id="popover-information">
        <Popover.Title as="h3">How we do it</Popover.Title>
        <Popover.Content>
          For the selected player/team we will use either the players
          percentile(bar, radar) or the actual stat numbers (rankings, scatter)
          this data is based off the 2020 season
        </Popover.Content>
      </Popover>
    );
    return (
      <OverlayTrigger
        trigger={["focus", "hover"]}
        placement="auto"
        overlay={popover}
      >
        <Button
          id="info"
          variant="outline-info"
          style={{
            borderRadius: "50%",
            fontSize: "18px",
            width: "38px",
            height: "38px",
            fontFamily: "Hoefler Text Bold Italic",
          }}
        >
          i
        </Button>
      </OverlayTrigger>
    );
  };

  renderAverageOrTotalCheckbox = () => {
    return (
      <div style={{ marginTop: "15px" }}>
        <Col>
          <Form>
            <Form.Check
              disabled={this.state.initialDisable}
              inline
              onChange={() => {
                if (this.state.graphType === "bar") {
                  this.setState({ refreshBarChart: true });
                }
                this.setState({
                  redirect: "/",
                  getNewPlayer1Data: true,
                  averageOrTotal: "average",
                  checked: true,
                });
              }}
              type="checkbox"
              checked={this.state.checked}
              id="average-checkbox"
              label="Average"
            ></Form.Check>
            <Form.Check
              disabled={this.state.initialDisable}
              onChange={() => {
                if (this.state.graphType === "bar") {
                  this.setState({ refreshBarChart: true });
                }
                this.setState({
                  redirect: "/",
                  getNewPlayer1Data: true,
                  averageOrTotal: "total",
                  checked: false,
                });
              }}
              inline
              type="checkbox"
              id="total-checkbox"
              checked={!this.state.checked}
              label="Total"
            ></Form.Check>
            {this.renderPopover()}
          </Form>
        </Col>
      </div>
    );
  };

  renderRankings = () => {
    let statsArray = [];
    let topNumbersArray = [];
    let topPlayersArray = [];
    let players = null;
    // This is used in a map below, to ensure that the right amount of games are pushed into the array
    let x = 0;
    let numberOfEntries = 50;
    let stat = this.state.barStat1[0].toLowerCase().split(" ").join("_");
    if (this.state.averageOrTotal === "average") {
      this.state.seasonPlayerStatsAverage.map((player) => {
        statsArray.push(player[stat]);
        return null;
      });
      players = this.state.seasonPlayerStatsAverage;
    } else {
      this.state.seasonPlayerStatsTotal.map((player) => {
        statsArray.push(player[stat]);
        return null;
      });
      players = this.state.seasonPlayerStatsTotal;
    }

    statsArray = statsArray.sort((a, b) => a - b);

    for (let i = 1; i < numberOfEntries; i++) {
      topNumbersArray.push(statsArray[statsArray.length - i]);
    }
    topNumbersArray.map((number) => {
      players.map((player) => {
        if (
          player[stat] === number &&
          x < numberOfEntries &&
          !topPlayersArray.includes(player)
        ) {
          topPlayersArray.push(player);
          x++;
        }
        return null;
      });
      return null;
    });

    return (
      <Col>
        <div className="tableFixHead">
          <Table bordered striped hover>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Games Played</th>
                <th>{this.state.barStat1}</th>
              </tr>
            </thead>
            <tbody>
              {topPlayersArray.map((player, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td> {player.player_name}</td>
                    <td>{player.games}</td>
                    <td>{player[stat]}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Col>
    );
  };

  // This function contains a case statement that will determine which graph is rendered to the page
  renderGraph = () => {
    switch (this.state.graphType) {
      default:
        return this.renderRadar();
      case "scatter":
        return this.renderScatterPlot();
      case "bar":
        return this.renderBarChart();
      case "rankings":
        return this.renderRankings();
    }
  };

  // Renders the control for the radar graph
  radarGraphControls = () => {
    return (
      <Col>
        {this.renderStatCheckBox()}
        <br></br>
        {/* {this.renderStatTemplates()} */}
        {this.state.playerOrTeam === "team"
          ? this.renderTeamDropDown()
          : this.renderPlayerDropDowns()}
        {this.renderAverageOrTotalCheckbox()}
      </Col>
    );
  };

  // Renders the controls for the scatter graph
  scatterGraphControls = () => {
    return (
      <>
        {this.renderStatDropDowns()}
        {this.state.playerOrTeam === "team"
          ? this.renderTeamDropDown()
          : this.renderPlayerDropDowns()}
        <div style={{ marginTop: "10px" }}>{this.renderPopover()}</div>
      </>
    );
  };

  // Renders the controls for the bar graph
  barGraphControls = () => {
    return (
      <>
        {this.renderStatDropDowns("bar")}
        {this.renderPlayerSelect()}
        {this.renderAverageOrTotalCheckbox()}
      </>
    );
  };

  rankingGraphControls = () => {
    return (
      <>
        {this.renderStatDropDowns("rankings")}
        {this.renderAverageOrTotalCheckbox()}
      </>
    );
  };

  // Handles logic to decide which graph to display
  graphSelect = () => {
    switch (this.state.graphType) {
      default:
        return this.radarGraphControls();

      case "scatter":
        return this.scatterGraphControls();

      case "bar":
        return this.barGraphControls();

      case "rankings":
        return this.rankingGraphControls();
    }
  };

  // Renders the graph control to screen
  renderGraphControl = () => {
    return (
      <Col sm={12} lg={4} md={4} xl={4} style={{ backgroundColor: "#eaecef" }}>
        {/* {this.renderPlayerAndTeamTabs()} */}
        {this.renderGraphTabs()}
        <br></br>
        {this.graphSelect()}

        {this.state.playerOrTeam === "team"
          ? this.renderPositionToggle()
          : null}
        <br></br>
        {/* {this.renderDateButtons()} */}
        {/* {this.renderVenueSelect()} */}

        {/* {this.renderMinimumGamesPlayed()} */}
        {/* {this.renderAdvancedOptions()} */}
      </Col>
    );
  };

  render() {
    if (this.state.redirect) {
      this.handleRefresh();
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <>
        <Row style={{ height: "100%" }}>
          {this.renderGraphControl()}
          {this.renderGraph()}
        </Row>
      </>
    );
  }
}

export default Home;
