import React from "react";

class Percentile extends React.Component {
  render() {
    const percentile = (arr, val) =>
      (100 *
        arr.reduce(
          (acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0),
          0
        )) /
      arr.length;

    const result = percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
    console.log(result);

    return result;
  }
}

export default Percentile;
