import React from 'react';
import * as d3 from 'd3';
import * as PropTypes from 'prop-types';
import D3Component from './D3Component';
import './TimeLine.scss';
import toIcon from '../../utils/toIcon';

export default class TimeLine extends D3Component {
  static propTypes = {
      selectedYear: PropTypes.number.isRequired,
      tickDuration: PropTypes.number.isRequired,
      data: PropTypes.any.isRequired,
      years: PropTypes.any.isRequired,
  };

  constructor(props) {
      super(props);
      this.state = {
          iconSize: 50,
      };
  }

  /** @override */
  firstDraw = (svg, width, height) => {
      const margin = {
          left: 40,
          top: 0,
          right: 40,
          bottom: 40,
      };

      this.main = svg
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('class', 'mainGroup')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

      this.xScale = d3
          .scaleLinear()
          .range([0, width - margin.right - margin.left])
          .domain([0, 5000]);

      this.yScale = d3
          .scaleLinear()
          .range([height - margin.bottom - margin.top, 0])
          .domain([0, 100]);

      const xAxis = d3.axisBottom().scale(this.xScale).ticks(10);

      const yAxis = d3.axisLeft().scale(this.yScale).ticks(10);

      const xAxisSvg = this.main
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0,${height - margin.bottom})`);

      xAxisSvg.call(xAxis);

      // Add label to x-axis
      xAxisSvg
          .append('text')
          .attr('transform', `translate (${width - margin.left - margin.right},0)`)
          .attr('dy', '-2em')
          .attr('text-anchor', 'end')
          .style('font', '14px sans-serif')
          .style('fill', 'black')
          .text('Cumulative score');

      const yAxisSvg = this.main.append('g').attr('class', 'y-axis');

      yAxisSvg.call(yAxis);

      // Add label to y-axis
      yAxisSvg
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('dy', '2em')
          .attr('text-anchor', 'end')
          .style('font', '14px sans-serif')
          .style('fill', 'black')
          .text('Season final score');

      this.yearGroup = this.main.append('g').attr('class', 'year-group');
      this.dotGroup = this.main.append('g').attr('class', 'dot-group');

      this.updateDraw();
  };

  /** @override */
  updateDraw = () => {
      const { tickDuration, data, selectedYear } = this.props;
      const { iconSize } = this.state;
      const periodData = data[selectedYear];

      const clubSvg = this.dotGroup
          .selectAll('.dot')
          .data(periodData, (d) => d.Club);

      clubSvg
          .exit()
          .transition()
          .duration(tickDuration)
          .attr('width', 0)
          .attr('height', 0)
          .attr(
              'transform',
              (d) => `translate(${this.xScale(d['Final score'])}, `
          + `${this.yScale(d['Season score'])})`,
          )
          .remove();

      clubSvg
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('width', iconSize)
          .attr('height', iconSize)
          .attr(
              'transform',
              (d) => `translate(${this.xScale(d['Final score']) - iconSize / 2}, `
          + `${this.yScale(d['Season score']) - iconSize / 2})`,
          );

      clubSvg
          .enter()
          .append('image')
          .attr('class', 'dot')
          .attr('width', 0)
          .attr('height', 0)
          .attr('opacity', 0.6)
          .attr('id', (d) => `club-${d.Club.replace(/[^\w]/gi, '')}`)
          .attr(
              'transform',
              (d) => `translate(${this.xScale(d['Final score'])}, `
          + `${this.yScale(d['Season score'])})`,
          )
          .attr('xlink:href', (d) => toIcon(d.Club))
          .transition()
          .duration(tickDuration)
          .attr('width', iconSize)
          .attr('height', iconSize)
          .attr(
              'transform',
              (d) => `translate(${this.xScale(d['Final score']) - iconSize / 2}, `
          + `${this.yScale(d['Season score']) - iconSize / 2})`,
          );

      d3.selectAll('.dot .tooltip').remove();

      d3.selectAll('.dot')
          .append('title')
          .attr('class', 'tooltip')
          .text((d) => `${d.Club} (${d['Season score']}, ${d['Final score']})`);

      this.addYearText();
  };

  addYearText() {
      const { selectedYear } = this.props;

      // console.log({ message: 'adding roslin-year-text', data: [{ selectedYear }] });

      const yearText = this.yearGroup
          .selectAll('.roslin-year-text')
          .data([{ year: selectedYear }], ({ year }) => year);

      yearText
          .enter()
          .append('text')
          .attr('class', 'roslin-year-text')
          .attr(
              'transform',
              () => `translate(${this.getWidth() / 2}, ${this.getHeight() / 2})`,
          )
          .style('fill', '#efedff')
          .style('font-weight', 'bolder')
          .style('text-anchor', 'middle')
          .style('font-size', '100pt')
          .text(({ year }) => year);

      yearText.exit().remove();
  }
}
