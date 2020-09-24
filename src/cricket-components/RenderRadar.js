import React from "react";

import { ResponsiveRadar } from "@nivo/radar";
import Col from "react-bootstrap/Col";

class RenderRadar extends React.Component {
  render() {
    const data = [
      {
        stat: "Runs",
        "Virat Kohli": 36,
        "Rohit Sharma": 36,
      },
      {
        stat: "Batting Average",
        "Virat Kohli": 97,
        "Rohit Sharma": 91,
      },
      {
        stat: "Batting Strike Rate",
        "Virat Kohli": 88,
        "Rohit Sharma": 88,
      },
      {
        stat: "Fours",
        "Virat Kohli": 53,
        "Rohit Sharma": 55,
      },
      {
        stat: "Sixes",
        "Virat Kohli": 99,
        "Rohit Sharma": 96,
      },
      {
        stat: "Balls Per Boundary",
        "Virat Kohli": 0,
        "Rohit Sharma": 0,
      },
      {
        stat: "Power Play Strike Rate",
        "Virat Kohli": 0,
        "Rohit Sharma": 0,
      },

      {
        stat: "Death Strike Rate",
        "Virat Kohli": 0,
        "Rohit Sharma": 0,
      },
      {
        stat: "Dot Ball Percentage",
        "Virat Kohli": 88,
        "Rohit Sharma": 88,
      },
    ];

    return (
      <Col sm={12} md={12} lg={6} xl={6}>
        <div className="graph-container">
          <ResponsiveRadar
            id="radarGraph"
            data={this.props.radarChartData || data}
            keys={[this.props.player1?.label, this.props.player2?.label]}
            indexBy="stat"
            maxValue="99"
            margin={{ top: 70, right: 110, bottom: 40, left: 110 }}
            curve="linearClosed"
            borderWidth={2}
            borderColor={{ from: "color" }}
            gridLevels={5}
            gridShape="linear"
            gridLabelOffset={5}
            enableDots={true}
            dotSize={6}
            dotColor={{ theme: "background" }}
            dotBorderWidth={1.5}
            dotBorderColor={{ from: "color" }}
            enableDotLabel={false}
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
      </Col>
    );
  }
}

export default RenderRadar;
