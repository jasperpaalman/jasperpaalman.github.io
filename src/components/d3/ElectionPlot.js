import React from 'react';
import * as d3 from 'd3';
import { darkBlue } from '../../theme';
import D3Component from './D3Component';
import './ElectionPlot.scss';

export default class ElectionPlot extends D3Component {
    constructor(props) {
        super(props);
        this.state = {
            margin: {
                top: 40,
                right: 100,
                bottom: 40,
                left: 100,
            },
            offset: {
                top: 0,
                right: 0,
                bottom: 20,
                left: 0,
            },
            previous: null,
            current: 'Overview',
        };
    }

  resizeToScreen = (val) => this.screenFactor * val;

  firstDraw = (svg, width, height) => {
      const { margin, offset } = this.state;

      /// //////////
      // Globals //
      /// //////////

      // Screen factor
      this.screenFactor = Math.min(width, height) / 350;
      // Transition duration
      this.transitionDuration = 1000;
      // Node size
      this.nodeSize = 7 * this.screenFactor;
      // Min and max number of seats
      this.seatsLowerBound = 0;
      this.seatsUpperBound = 35;

      // Set data
      this.data = {
          VVD: { color: '#455493', seats: 34, diff: 1 },
          D66: { color: '#4AAB2D', seats: 24, diff: 5 },
          PVV: { color: '#00B9FF', seats: 17, diff: -3 },
          CDA: { color: '#00894B', seats: 15, diff: -4 },
          PvdA: { color: '#9A0D1B', seats: 9, diff: 0 },
          SP: { color: '#C73D77', seats: 9, diff: -5 },
          GL: { color: '#006B39', seats: 8, diff: -6 },
          FvD: { color: '#6E0C13', seats: 8, diff: 6 },
          PvdD: { color: '#EBC30A', seats: 6, diff: 1 },
          CU: { color: '#0094B4', seats: 5, diff: 0 },
          JA21: { color: '#242B57', seats: 3, diff: 3 },
          Volt: { color: '#4E2277', seats: 3, diff: 3 },
          SGP: { color: '#7F8084', seats: 3, diff: 0 },
          Denk: { color: '#41BAC1', seats: 3, diff: 0 },
          '50PLUS': { color: '#C2791E', seats: 1, diff: -3 },
          BBB: { color: '#004a07', seats: 1, diff: 1 },
          BIJ1: { color: '#000000', seats: 1, diff: 1 },
      };

      /// ////////
      // Other //
      /// ////////

      // Get parties
      this.partyList = Object.keys(this.data);

      this.width = width
      - this.resizeToScreen(margin.left)
      - this.resizeToScreen(margin.right);
      this.height = height
      - this.resizeToScreen(margin.top)
      - this.resizeToScreen(margin.bottom);

      this.main = svg
          .append('g')
          .attr(
              'transform',
              `translate(${this.resizeToScreen(margin.left)},${this.resizeToScreen(
                  margin.top,
              )})`,
          )
          .attr('id', 'electionPlot')
          .attr('class', 'persistent');

      /// ///////
      // Menu //
      /// ///////

      this.plotMenu();

      /// ///////////////
      // Build Scales //
      /// ///////////////

      this.x = d3.scaleLinear();

      this.y = d3.scalePoint();

      /// ////////////
      // Plot Axes //
      /// ////////////

      this.axisX = this.main
          .append('g')
          .attr('class', 'axis axis-x persistent')
          .attr(
              'transform',
              `translate(0,${this.height + this.resizeToScreen(offset.bottom)})`,
          );

      this.axisY = this.main
          .append('g')
          .attr('class', 'axis axis-y persistent')
          .attr('transform', `translate(${this.width / 2}, 0)`);

      /// ///////////////////
      // Plot Party Nodes //
      /// ///////////////////

      const nodesGroup = this.main.append('g').attr('class', 'nodes persistent');

      this.nodes = nodesGroup
          .selectAll('.node')
          .data(this.partyList)
          .enter()
          .append('circle')
          .attr('class', 'node persistent')
          .attr('id', (p) => p)
          .style('stroke', (p) => this.data[p].color)
          .style('fill', (p) => this.data[p].color)
          .attr('r', this.nodeSize)
          .attr('cx', (p, i) => (this.width / this.partyList.length) * i)
          .attr('cy', this.height / 2);

      this.nodes
          .append('title')
          .attr('class', 'tooltip persistent')
          .text((p) => p);

      /// /////////
      // Update //
      /// /////////

      this.updateDraw();
  };

  updateDraw = () => {
      const { current } = this.state;

      // Clear SVG of non-persistent elements
      const nonPersistent = this.main
          .selectAll('*')
          .filter((d, i, elem) => !d3.select(elem[i]).classed('persistent'));
      nonPersistent.remove();

      // Reset Nodes
      this.nodes.data(this.partyList).attr('r', this.nodeSize);

      this.nodes.on('click', null).on('mouseover', null).on('mouseout', null);

      // Remove any simulation
      if (this.simulation) {
          this.simulation.stop();
      }

      // Callback
      const callback = {
          Overview: this.plotOverview,
          Force: this.plotForce,
          Difference: this.plotDifference,
      };

      callback[current]();
  };

  plotMenu = () => {
      const options = ['Overview', 'Force', 'Difference'];
      const optionHeight = this.resizeToScreen(20);
      const optionWidth = this.resizeToScreen(60);
      const spacing = this.resizeToScreen(5);
      const yOffset = this.resizeToScreen(30);

      const menu = this.main
          .append('g')
          .attr('id', 'menu')
          .attr('class', 'persistent');
      const option = menu
          .selectAll('.menu-option')
          .data(options)
          .enter()
          .append('g')
          .attr('class', 'menu-option generic-button persistent');

      option
          .append('rect')
          .attr('class', 'menu-block persistent')
          .attr('x', (d, i) => (optionWidth + spacing) * i)
          .attr('y', -yOffset)
          .attr('rx', 6)
          .attr('ry', 6)
          .attr('width', optionWidth)
          .attr('height', optionHeight)
          .style('fill', 'white')
          .style('stroke', `${darkBlue}`);

      option
          .append('text')
          .attr('class', 'menu-text persistent')
          .attr('x', (d, i) => optionWidth * 0.5 + (optionWidth + spacing) * i)
          .attr('y', -yOffset + optionHeight * 0.5)
          .text((d) => d)
          .attr('dominant-baseline', 'central')
          .style('text-anchor', 'middle')
          .style('font', '10px sans-serif')
          .style('fill', `${darkBlue}`);

      option.on('click', (event, d) => {
          this.setState({ current: d });
          this.updateDraw();
      });
  };

  plotOverview = () => {
      /// ///////////////
      // Build Scales //
      /// ///////////////

      // Build the Y scale - each number of seats maps to a y-location

      this.x
          .domain([this.seatsLowerBound, this.seatsUpperBound])
          .range([0, this.width]);

      // Build the X scale - each date maps to a x-location
      this.y.domain(this.partyList).range([0, this.height]);

      /// ////////////
      // Plot Axes //
      /// ////////////

      this.axisX
          .transition()
          .duration(this.transitionDuration)
          .call(d3.axisBottom(this.x));

      /// /////////////
      // Plot Nodes //
      /// /////////////

      this.nodes
          .transition()
          .duration(this.transitionDuration)
          .attr('cx', (p) => this.x(this.data[p].seats))
          .attr('cy', (p) => this.y(p));

      /// //////////////////
      // Plot Node Labels //
      /// //////////////////

      const nodeLabels = this.main
          .append('g')
          .attr('class', 'node-labels')
          .selectAll('g')
          .data(this.partyList)
          .enter()
          .append('g')
          .attr('class', 'node-label')
          .attr(
              'transform',
              (p) => `translate(${this.x(this.data[p].seats)}, ${this.y(p)})`,
          )
          .attr('opacity', 0);

      nodeLabels
          .append('text')
          .attr('class', 'node-name')
          .attr('text-anchor', 'end')
          .attr('dominant-baseline', 'central')
          .attr('dx', -(this.nodeSize + 4))
          .style('fill', (p) => this.data[p].color)
          .text((p) => p);

      nodeLabels
          .append('text')
          .attr('class', 'node-score')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .style('font', '10px sans-serif')
          .style('fill', 'white')
          .text((p) => this.data[p].seats);

      nodeLabels
          .append('text')
          .attr('class', 'node-diff')
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'central')
          .attr('dx', this.nodeSize + 4)
          .style('font', '10px sans-serif')
          .style('font-weight', 'bold')
          .style('fill', (p) => {
              const { diff } = this.data[p];
              if (diff < 0) {
                  return '#EA4335';
              }
              if (diff > 0) {
                  return '#3AA757';
              }
              return '#9AA0A6';
          })
          .text((p) => {
              const { diff } = this.data[p];
              return diff <= 0 ? diff : `+${diff}`;
          });

      nodeLabels
          .transition()
          .duration(this.transitionDuration)
          .attr('opacity', 1);
  };

  plotForce = () => {
      /// /////////////
      // Simulation //
      /// /////////////

      const data = this.partyList.map((p) => ({
          name: p,
          selected: false,
          x: this.width * 0.25,
          y: this.height * 0.75,
      }));

      this.nodes
          .data(data)
          .transition()
          .duration(this.transitionDuration)
          .attr('r', (p) => this.data[p.name].seats * 1.5)
          .attr('cx', this.width * 0.25)
          .attr('cy', this.height * 0.75);

      // Force simulation function
      this.simulation = d3
          .forceSimulation(data)
          .alphaTarget(0.3) // stay hot
          .velocityDecay(0.1) // low friction
          .force('x', d3.forceX(this.width * 0.25).strength(0.02))
          .force('y', d3.forceY(this.height * 0.75).strength(0.02)) // middle
          .force(
              'collide',
              d3
                  .forceCollide()
                  .radius((p) => this.data[p.name].seats * 1.5 + 4)
                  .iterations(1),
          )
          .on('tick', () => {
              this.nodes.attr('cx', (p) => p.x).attr('cy', (p) => p.y);
          });

      // Delay
      this.simulation.stop();
      setTimeout(() => this.simulation.restart(), this.transitionDuration);

      /// ////////
      // Count //
      /// ////////

      const options = ['unselected', 'selected'];

      const counts = this.main
          .append('g')
          .attr('class', 'counts')
          .attr('opacity', 0);

      counts
          .selectAll('.count')
          .data(options)
          .enter()
          .append('text')
          .attr('class', (d) => `count ${d}`)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('x', (d, i) => (d === 'unselected' ? this.width * 0.25 : this.width * 0.75))
          .attr('y', this.height * 0.25)
          .style('font', '18px sans-serif')
          .style('fill', '#383838')
          .text((d, i) => data
              .filter((d1) => (d === 'unselected' ? !d1.selected : d1.selected))
              .map((d2) => this.data[d2.name].seats)
              .reduce((a, b) => a + b, 0));

      // Animate
      this.nodes
          .on('mouseover', (event) => d3
              .select(event.currentTarget)
              .style('stroke-width', 3)
              .style('stroke', '#383838'))
          .on('mouseout', (event) => d3.select(event.currentTarget).style('stroke', null))
          .on('click', (event) => {
              // Make selection
              const node = d3.select(event.currentTarget);
              const nodeData = data.find((d) => d.name === node.datum().name);
              nodeData.selected = !nodeData.selected;

              // Change force left <---> right
              this.simulation.force(
                  'x',
                  d3
                      .forceX()
                      .strength((p, i, elem) => {
                          // When selected increased strength
                          if (node.datum().name === elem[i].name) {
                              return 0.2;
                          }
                          // Otherwise normal
                          return 0.02;
                      })
                      .x((p) => {
                          if (p.selected) {
                              return this.width * 0.75;
                          }
                          return this.width * 0.25;
                      }),
              );

              // Reset force to normal (0.02)
              setTimeout(
                  () => this.simulation.force(
                      'x',
                      d3
                          .forceX()
                          .strength(0.02)
                          .x((p) => {
                              if (p.selected) {
                                  return this.width * 0.75;
                              }
                              return this.width * 0.25;
                          }),
                  ),
                  25,
              );

              // Re-calculate the counts
              d3.selectAll('.count').text((d, i) => data
                  .filter((d1) => (d === 'unselected' ? !d1.selected : d1.selected))
                  .map((d2) => this.data[d2.name].seats)
                  .reduce((a, b) => a + b, 0));
          });

      counts.transition().duration(this.transitionDuration).attr('opacity', 1);
  };

  plotDifference = () => {
      /// ///////////////
      // Build Scales //
      /// ///////////////

      // Build the Y scale - each number of seats maps to a y-location

      this.x.domain([-10, 10]).range([0, this.width]);

      // Build the X scale - each date maps to a x-location
      this.y.domain(this.partyList).range([0, this.height]);

      /// ////////////
      // Plot Axes //
      /// ////////////

      //   this.axisY
      //       .transition()
      //       .duration(this.transitionDuration)
      //       .call(d3.axisLeft(this.y).tickValues([]));

      /// /////////////
      // Plot Nodes //
      /// /////////////

      this.nodes
          .transition()
          .duration(this.transitionDuration)
          .attr('cx', (p) => this.x(this.data[p].diff))
          .attr('cy', (p) => this.y(p));

      /// //////////////////
      // Plot Node Labels //
      /// //////////////////

      const nodeLabels = this.main
          .append('g')
          .attr('class', 'node-labels')
          .selectAll('g')
          .data(this.partyList)
          .enter()
          .append('g')
          .attr('class', 'node-label')
          .attr(
              'transform',
              (p) => `translate(${this.x(this.data[p].diff)}, ${this.y(p)})`,
          )
          .attr('opacity', 0);

      // Name
      nodeLabels
          .append('text')
          .attr('class', 'node-name')
          .attr('text-anchor', (p) => (this.data[p].diff <= 0 ? 'end' : 'start'))
          .attr('dominant-baseline', 'central')
          .attr(
              'dx',
              (p) => (this.data[p].diff <= 0 ? -1 : 1) * (this.nodeSize + 4),
          )
          .style('fill', (p) => this.data[p].color)
          .text((p) => p);

      // Score
      nodeLabels
          .append('text')
          .attr('class', 'node-score')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .style('font', '10px sans-serif')
          .style('fill', 'white')
          .text((p) => this.data[p].diff);

      // Connectors
      const paths = nodeLabels
          .append('path')
          .attr('class', 'node-connector')
          .attr('d', (p) => {
              const { diff } = this.data[p];
              let offset = 0;
              if (diff > 0) {
                  offset = -this.nodeSize;
              } else if (diff < 0) {
                  offset = this.nodeSize;
              }

              return `M ${offset} 0 H ${this.x(0) - this.x(this.data[p].diff)}`;
          })
          .style('stroke', (p) => this.data[p].color)
          .style('stroke-width', 2);

      // Animate
      paths.each((d, i, elem) => {
          const path = d3.select(elem[i]);
          const totalLength = path.node().getTotalLength();

          path
              .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
              .attr('stroke-dashoffset', totalLength)
              .transition()
              .duration(this.transitionDuration)
              .ease(d3.easeLinear)
              .attr('stroke-dashoffset', 0);
      });

      // Transition

      nodeLabels
          .transition()
          .duration(this.transitionDuration)
          .attr('opacity', 1);
  };
}
