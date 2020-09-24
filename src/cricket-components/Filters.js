import React from "react";
import { Form, Col, Button, ButtonGroup, Row } from "react-bootstrap";

import Select, { createFilter, components } from "react-select";
import MenuList from "./MenuList";

class Filters extends React.Component {
  state = {
    stats: [
      "Fours",
      "Sixes",
      "Balls Per Boundary",
      "Batting Average",
      "Batting Strike Rate",
      "Bowling Average",
      "Bowling Economy Rate",
      "Catches",
      "Death Overs Economy Rate",
      "Death Strike Rate",
      "Dot Ball Percentage",
      "Power Play Strike Rate",
      "Power Play Economy Rate",
      "Run Outs",
      "Runs",
      "Stumpings",
      "Wickets",
      "Dismissed",
      "Runs Conceded",
      "Man Of The Match",
      "Games Played",
    ],
  };

  componentDidMount() {
    this.props.passStatsToState(this.state.stats);
  }

  componentDidUpdate() {
    console.log(this.props);
  }

  renderCheckboxes = () => {
    let stats = [
      ["Fours", "Sixes"],
      ["Balls Per Boundary", "Batting Average"],
      ["Batting Strike Rate", "Bowling Average"],
      ["Bowling Economy Rate", "Catches"],
      ["Death Overs Economy Rate", "Death Strike Rate"],
      ["Dot Ball Percentage", "Power Play Strike Rate"],
      ["Power Play Economy Rate", "Run Outs"],
      ["Runs", "Stumpings"],
      ["Wickets", "Man Of The Match"],
    ];
    return stats.map((stat) => {
      return (
        <div>
          <Form.Row>
            <Col>
              <Form.Check
                onChange={this.props.statCheckboxClickHandler}
                checked={this.props.selectedStats.includes(stat[0])}
                inline
                label={stat[0]}
                id={stat[0]}
                type="checkbox"
              />
            </Col>
            <Col>
              <Form.Check
                onChange={this.props.statCheckboxClickHandler}
                checked={this.props.selectedStats.includes(stat[1])}
                inline
                label={stat[1]}
                id={stat[1]}
                type="checkbox"
              />
            </Col>
          </Form.Row>
        </div>
      );
    });
  };

  renderTemplateButtons = () => {
    return (
      <div className="graph-control-item-group">
        <ButtonGroup
          onClick={this.props.playerTemplateClickHandler}
          size="sm"
          type="radio"
        >
          <Button className="template-button" variant="outline-secondary">
            Batsman
          </Button>
          <Button className="template-button" variant="outline-secondary">
            Bowler
          </Button>
          <Button className="template-button" variant="outline-secondary">
            Wicket Keeper
          </Button>
          <Button className="template-button" variant="outline-secondary">
            All Rounder
          </Button>
        </ButtonGroup>
      </div>
    );
  };

  renderVenueSelect = () => {
    let options = [];
    this.props.venues.map((venue) => {
      options.push({ label: venue.venue, value: venue.venueid });
    });

    return (
      <div className="graph-control-item-group">
        <Select
          filterOption={createFilter({ ignoreAccents: false })}
          components={{ MenuList }}
          isMulti
          closeMenuOnSelect={false}
          openMenuOnFocus={true}
          placeholder="Venues"
          name="venues"
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
    );
  };

  renderDomesticCheckboxes = () => {
    return (
      <div className="graph-control-item-group">
        <Col>
          <Form.Check
            onChange={this.props.competitionClickHandler}
            defaultChecked={true}
            checked={this.props.competition.includes("domestic")}
            inline
            type="switch"
            id="domestic-switch"
            label="Domestic Matches"
            value="domestic"
          />
          <Form.Check
            onChange={this.props.competitionClickHandler}
            defaultChecked={true}
            checked={this.props.competition.includes("international")}
            inline
            type="switch"
            id="international-switch"
            label="International Matches"
            value="international"
          />
        </Col>
      </div>
    );
  };

  renderLeagueSelect = () => {
    const customStyles = {
      valueContainer: (provided, state) => ({
        ...provided,
        textOverflow: "ellipsis",
        maxWidth: "90%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        display: "initial",
      }),
    };

    const groupStyles = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    };
    const groupBadgeStyles = {
      backgroundColor: "#EBECF0",
      borderRadius: "2em",
      color: "#172B4D",
      display: "inline-block",
      fontSize: 12,
      fontWeight: "normal",
      lineHeight: "1",
      minWidth: 1,
      padding: "0.16666666666667em 0.5em",
      textAlign: "center",
    };

    const formatGroupLabel = (data) => (
      <div style={groupStyles}>
        <span>{data.label}</span>
        <span style={groupBadgeStyles}>{data.options.length}</span>
      </div>
    );

    let options = [];

    const multiValueContainer = ({ selectProps, data }) => {
      const label = data.label;
      const allSelected = selectProps.value;
      const index = allSelected.findIndex(
        (selected) => selected.label === label
      );
      const isLastSelected = index === allSelected.length - 1;
      const labelSuffix = isLastSelected ? ` (${allSelected.length})` : ", ";
      const val = `${label}${labelSuffix}`;
      return val;
    };

    if (
      this.props.competition.length < 2 &&
      this.props.competition[0] === "domestic"
    ) {
      this.props.domesticLeagues.map((league) => {
        options.push({ label: league.league, value: league.league_id });
      });
    } else if (
      this.props.competition.length < 2 &&
      this.props.competition[0] === "international"
    ) {
      this.props.internationalLeagues.map((league) => {
        options.push({ label: league.league, value: league.league_id });
      });
    } else {
      this.props.leagues.map((league) => {
        options.push({ label: league.league, value: league.league_id });
      });
    }

    return (
      <div className="control-item">
        <Select
          styles={customStyles}
          formatGroupLabel={formatGroupLabel}
          filterOption={createFilter({ ignoreAccents: false })}
          components={{ MenuList, MultiValueContainer: multiValueContainer }}
          isMulti
          closeMenuOnSelect={false}
          name="leagues"
          placeholder="Leagues"
          options={options}
          className="basic-select"
          classNamePrefix="select"
          hideSelectedOptions={false}
          onChange={this.props.leagueClickHandler}
          onMenuClose={() => {
            this.props.getLeagueStats();
          }}
          openMenuOnFocus={true}
          value={this.props.selectedLeagues}
        />
      </div>
    );
  };

  render() {
    return (
      <Form>
        {this.renderDomesticCheckboxes()}
        {this.renderLeagueSelect()}
        {this.renderTemplateButtons()}
        {this.renderCheckboxes()}
        {/* {this.renderVenueSelect()} */}
      </Form>
    );
  }
}

export default Filters;
