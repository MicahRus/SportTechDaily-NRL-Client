import React from "react";

class Test extends React.Component {
  render() {
    debugger;
    console.log(this.props);
    let player1Percentiles = [];
    let player2Percentiles = [];
    const percentile = (arr, val) =>
      (100 *
        arr.reduce(
          (acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0),
          0
        )) /
      arr.length;

    this.props.state.selectedStats.map((stat) => {
      let newStat = stat.split(" ").join("_").toLowerCase();

      if (this.props.state.player1Stats[newStat] > 0) {
        player1Percentiles.push(
          Math.round(
            percentile(
              this.props.state.totalStats[newStat],
              this.props.state.player1Stats[newStat]
            )
          )
        );
      } else {
        player1Percentiles.push(0);
      }
      if (this.props.state.player2Stats[newStat] > 0) {
        player2Percentiles.push(
          Math.round(
            percentile(
              this.props.state.totalStats[newStat],
              this.props.state.player2Stats[newStat]
            )
          )
        );
      } else {
        player2Percentiles.push(0);
      }
    });
    this.props.function(player1Percentiles, player2Percentiles);
    return <div> HEllo world</div>;
  }
}

export default Test;
