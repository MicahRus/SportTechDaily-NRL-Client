import React from "react";

class SetStats extends React.Component {
  render() {
    const stats = [
      "all_run_metres",
      "conversions",
      "errors",
      "fantasy",
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
    let fantasy = [];
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
      stats.map((stat, i) => {
        switch (i) {
          default:
            all_run_metres.push(player[stat]);
            break;
          case 1:
            conversions.push(player[stat]);
            break;
          case 2:
            errors.push(player[stat]);
            break;
          case 3:
            fantasy.push(player[stat]);
            break;
          case 4:
            field_goals.push(player[stat]);
            break;
          case 5:
            kick_metres.push(player[stat]);
            break;
          case 6:
            line_break_assists.push(player[stat]);
            break;
          case 7:
            line_breaks.push(player[stat]);
            break;
          case 8:
            minutes_played.push(player[stat]);
            break;
          case 9:
            offloads.push(player[stat]);
            break;
          case 10:
            minutes_played.push(player[stat]);
            break;
          case 11:
            one_on_one_steal.push(player[stat]);
            break;
          case 12:
            post_contact_metres.push(player[stat]);
            break;
          case 13:
            tackle_breaks.push(player[stat]);
            break;
          case 14:
            tackle_efficiency.push(player[stat]);
            break;
          case 15:
            tackles_made.push(player[stat]);
            break;
          case 16:
            tries.push(player[stat]);
            break;
          case 17:
            try_assists.push(player[stat]);
            break;
          case 18:
            missed_tackles.push(player[stat]);
            break;
        }
      });
    });
    const allStats = [
      { all_run_metres },
      { conversions },
      { errors },
      { fantasy },
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
    console.log(allStats);
    return allStats;
  }
}

export default SetStats;
