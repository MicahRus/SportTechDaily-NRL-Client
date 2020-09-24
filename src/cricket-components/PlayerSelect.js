import React from "react";
import Select, { createFilter } from "react-select";

import MenuList from "./MenuList";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class PlayerSelect extends React.Component {
  state = {
    playerOptions: [{ value: "test", label: "test" }],
  };

  disabledOption = (option) => {
    if (
      option.value === this.props.options.player1?.value ||
      option.value === this.props.options.player2?.value
    ) {
      return true;
    }
  };

  renderButtons = () => {
    let options = [];

    if (this.props.options.selectedLeagues.length > 0) {
      this.props.options.post2017Players.map((player) => {
        this.props.options.post2017LeagueStats.map((league) => {
          if (player.playerid === league.player_id) {
            options.push({
              value: player.playerid,
              label: player.player,
            });
          }
        });
      });
    } else {
      this.props.options.post2017Players.map((player) => {
        options.push({ value: player.playerid, label: player.player });
      });
    }

    const customStyles = {
      container: (provided, state) => ({
        ...provided,

        margin: "10px 0px",
      }),
    };
    return (
      <Row>
        <Col>
          <Select
            placeholder="Virat Kohli"
            isOptionDisabled={(option) => this.disabledOption(option)}
            filterOption={createFilter({ ignoreAccents: false })}
            components={{ MenuList }}
            styles={customStyles}
            options={options}
            onChange={(e) => this.props.playerSelectClickHandler("player1", e)}
          ></Select>
        </Col>
        <Col>
          <Select
            placeholder="Rohit Sharma"
            isOptionDisabled={(option) => this.disabledOption(option)}
            filterOption={createFilter({ ignoreAccents: false })}
            styles={customStyles}
            options={options}
            components={{ MenuList }}
            onChange={(e) => this.props.playerSelectClickHandler("player2", e)}
          ></Select>
        </Col>
      </Row>
    );
  };

  render() {
    return this.renderButtons();
  }
}

export default PlayerSelect;
