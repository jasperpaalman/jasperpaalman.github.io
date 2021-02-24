import React from "react";
import * as d3 from "d3";
import * as PropTypes from "prop-types";
import D3Component from "./D3Component";
import "./HeadToHeadPlot.scss";

export default class HeadToHeadPlot extends D3Component {
  static propTypes = {
    matches: PropTypes.any.isRequired,
    teams: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      margin: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
      },
      iconSize: 40,
      nMatches: 10,
      barPadding: 0.4,
    };
  }

  /** @override   */
  firstDraw = (svg, width, height) => {
    const { margin, barPadding, nMatches } = this.state;
    const { matches } = this.props;
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    const matchData = matches.slice(-nMatches);

    const main = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "head-to-head");

    if (matches.length !== 0) {
      this.x = d3
        .scaleBand()
        .range([
          plotWidth -
            (plotWidth / nMatches) * d3.min([nMatches, matches.length]),
          plotWidth,
        ])
        .padding(barPadding);
      this.y = d3.scaleLinear().range([plotHeight, 0]);

      matchData.forEach((d, i) => {
        const scoreTeamA = +d.scoreTeamA;
        const scoreTeamB = +d.scoreTeamB;

        matchData[i].goalDifference = scoreTeamA - scoreTeamB;
      });

      const maxAbs = d3.max(matchData.map((d) => Math.abs(d.goalDifference)));

      this.x.domain([...Array(matchData.length).keys()]);
      this.y.domain([-maxAbs, maxAbs]);

      // Add x-axis
      const xAxis = main
        .append("g")
        .attr("transform", `translate(0,${this.y(0)})`)
        .call(d3.axisBottom(this.x).tickFormat(""));

      const entries = main
        .selectAll("rect")
        .data(matchData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(${this.x(i)}, 0)`);

      entries
        .append("rect")
        .attr("class", "bar")
        .attr("y", (d) => {
          if (d.goalDifference >= 0) {
            return this.y(d.goalDifference);
          }
          return this.y(0);
        })
        .attr("width", this.x.bandwidth())
        .attr("height", (d) => Math.abs(this.y(0) - this.y(d.goalDifference)));

      entries
        .append("text")
        .attr("y", this.y(0))
        .attr("dx", this.x.bandwidth() / 2)
        .attr("dy", (d) => (d.goalDifference >= 0 ? 15 : -15))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font", "12px sans-serif")
        .text((d) => d.year);

      // mouseover event handler function
      this.onMouseOver = (event, d) => {
        const element = d3.select(event.currentTarget);
        const elemBar = element.select("rect");
        const locY = this.y(d.goalDifference);

        if (d.goalDifference !== 0) {
          elemBar
            .attr("class", "highlight")
            .transition() // add animation
            .duration(400)
            .attr("width", this.x.bandwidth() + 5)
            .attr("y", () => {
              if (d.goalDifference >= 0) {
                return locY - 10;
              }
              return this.y(0);
            })
            .attr("height", Math.abs(this.y(0) - locY) + 10);
        }

        // Add appropriate text
        element
          .append("text")
          .attr("class", "val")
          .attr("dx", this.x.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", d.goalDifference < 0 ? "hanging" : null)
          .attr("y", () => {
            if (d.goalDifference >= 0) {
              return locY - 15;
            }
            return locY + 15;
          })
          .text(`${d.scoreTeamA}-${d.scoreTeamB}`);
      };

      // mouseout event handler function
      this.onMouseOut = (event, d) => {
        const element = d3.select(event.currentTarget);
        const elemBar = element.select("rect");

        // Change settings back
        elemBar
          .attr("class", "bar")
          .transition() // add animation
          .duration(400)
          .attr("width", this.x.bandwidth())
          .attr("y", () => {
            if (d.goalDifference >= 0) {
              return this.y(d.goalDifference);
            }
            return this.y(0);
          })
          .attr("height", Math.abs(this.y(0) - this.y(d.goalDifference)));
        // Remove text
        d3.selectAll(".val").remove();
      };

      entries.on("mouseover", this.onMouseOver); // Add listener for the mouseover event
      entries.on("mouseout", this.onMouseOut); // Add listener for the mouseout event

      xAxis.raise();
    }
  };

  /**  @override */
  updateDraw = () => {
    const { id } = this;
    // eslint-disable-next-line
    const svg = document.getElementById(id);
    svg.innerHTML = "";

    // Redraw everything
    this.firstDrawWrapper();
  };
}
