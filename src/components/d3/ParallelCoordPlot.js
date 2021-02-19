import * as d3 from 'd3';
import * as PropTypes from 'prop-types';
import React from 'react';
import D3Component from './D3Component';
import './ParallelCoordPlot.scss';
import { toIcon } from '../../util';

export default class TimeLine extends D3Component {
  static propTypes = {
      data: PropTypes.any.isRequired,
      years: PropTypes.any.isRequired,
      defaultYear: PropTypes.any.isRequired,
  };

  constructor(props) {
      super(props);
      this.state = {
          margin: {
              top: 190,
              right: 40,
              bottom: 230,
              left: 40,
          },
          offset: 120,
          iconSize: 20,
      };
  }

  /** @override   */
  firstDraw = (svg, width, height) => {
      const { margin, offset } = this.state;
      const { defaultYear } = this.props;

      const colors = [
          '#1f77b4',
          '#aec7e8',
          '#ff7f0e',
          '#ffbb78',
          '#2ca02c',
          '#98df8a',
          '#d62728',
          '#ff9896',
          '#9467bd',
          '#c5b0d5',
          '#8c564b',
          '#c49c94',
          '#e377c2',
          '#f7b6d2',
          '#7f7f7f',
          '#c7c7c7',
          '#bcbd22',
          '#dbdb8d',
          '#17becf',
          '#9edae5',
      ];
      this.color = d3.scaleOrdinal(colors);
      this.focusClub = null;

      const main = svg.attr('id', 'main-pcp-canvas');

      this.width = width - margin.left - margin.right - offset;
      this.height = height - margin.top - margin.bottom;

      this.filter = main
          .append('g')
          .attr('transform', `translate(${margin.left},0)`)
          .attr('id', 'year-selector');

      this.createYearSelector();

      this.pcp = main
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`)
          .attr('id', 'pcp');

      this.updateDraw(defaultYear);
  };

  createYearSelector = () => {
      const { years, defaultYear } = this.props;

      const arrowWidth = 15;
      const arrowMargin = 5;
      const selectorHeight = 15;

      const selectorArrows = this.filter
          .append('g')
          .attr('class', 'selector-arrows');

      const selectorBlocks = this.filter
          .append('g')
          .attr('class', 'selector-blocks')
          .attr('transform', `translate(${arrowWidth + arrowMargin}, 0)`)
          .selectAll('rect')
          .data(years)
          .enter();

      selectorArrows
          .append('path')
          .attr('id', 'arrow-backward')
          .attr('class', 'arrow selector')
          .attr(
              'd',
              `m 0 ${selectorHeight / 2} l ${arrowWidth} ${
                  selectorHeight / 2
              } l 0 ${-selectorHeight}`,
          )
          .style('fill', '#271D66')
          .on('click', () => {
              const newYear = this.currentYear - 1;
              const selectors = selectorBlocks.selectAll('rect');

              if (years.includes(newYear)) {
                  selectors.filter((y) => y === newYear).style('fill', '#271D66');
                  selectors.filter((y) => y !== newYear).style('fill', 'white');
                  this.updateDraw(newYear);
              }
          });

      selectorArrows
          .append('path')
          .attr('id', 'arrow-forward')
          .attr('class', 'arrow selector')
          .attr(
              'd',
              `m ${this.width - arrowWidth} 0 l ${arrowWidth} 
                ${selectorHeight / 2} l  ${-arrowWidth} ${selectorHeight / 2}`,
          )
          .style('fill', '#271D66')
          .on('click', () => {
              const newYear = this.currentYear + 1;
              const selectors = selectorBlocks.selectAll('rect');

              if (years.includes(newYear)) {
                  selectors.filter((y) => y === newYear).style('fill', '#271D66');
                  selectors.filter((y) => y !== newYear).style('fill', 'white');
                  this.updateDraw(newYear);
              }
          });

      selectorBlocks
          .append('rect')
          .attr('class', 'year selector')
          .attr(
              'width',
              (this.width - 2 * (arrowWidth + arrowMargin)) / years.length,
          )
          .attr('height', selectorHeight)
          .attr(
              'x',
              (year, i) => (i * (this.width - 2 * (arrowWidth + arrowMargin))) / years.length,
          )
          .style('fill', (year) => {
              if (year === defaultYear) {
                  return '#271D66';
              }
              return 'white';
          })
          .style('stroke', '#271D66')
          .on('click', (event, year) => {
              const selectors = selectorBlocks.selectAll('rect');

              selectors.filter((y) => y === year).style('fill', '#271D66');
              selectors.filter((y) => y !== year).style('fill', 'white');

              this.updateDraw(year);
          });

      selectorBlocks
          .append('text')
          .style('text-anchor', 'middle')
          .attr(
              'x',
              (year, i) => ((i + 1) * (this.width - 2 * (arrowWidth + arrowMargin)))
          / years.length,
          )
          .attr('dy', selectorHeight + 10)
          .attr('dominant-baseline', 'hanging')
          .text((year, i) => {
              if (i % 2 === 0) {
                  return year;
              }
              return '';
          })
          .style('font', '11px sans-serif')
          .style('fill', 'black');
  };

  // KPI blocks //

  addKPI = () => {
      const { data, defaultYear } = this.props;

      const KPIBlockMargin = 10;
      const KPIHeight = 50;

      const defaultKPIDict = data[defaultYear].KPI.Overall;
      const KPIKeys = [
          'Won',
          'Drawn',
          'Lost',
          'Goals For',
          'Goals Against',
          'Goal Difference',
          'Points Per Match',
      ];

      const KPIBlocks = this.pcp
          .append('g')
          .attr('transform', `translate(0, ${this.height + 135})`)
          .attr('class', 'kpi-blocks');

      const KPIBlock = KPIBlocks.selectAll('g')
          .data(KPIKeys)
          .enter()
          .append('g')
          .attr('class', 'kpi-block');

      KPIBlock.append('rect')
          .attr('class', 'kpi-area')
          .attr('width', this.width / KPIKeys.length - KPIBlockMargin)
          .attr('height', KPIHeight)
          .attr('rx', 6)
          .attr('ry', 6)
          .attr(
              'x',
              (kpi, i) => (i * (this.width - KPIBlockMargin)) / KPIKeys.length,
          )
          .style('fill', (d) => {
              if (d === 'Won') {
                  return '#416CAF';
              }
              if (d === 'Drawn') {
                  return '#DAB042';
              }
              if (d === 'Lost') {
                  return '#D55150';
              }
              return '#607d8b';
          });

      KPIBlock.append('text')
          .attr('class', 'kpi-title')
          .attr(
              'x',
              (kpi, i) => ((i + 0.5) * (this.width - KPIBlockMargin)) / KPIKeys.length,
          )
          .attr('dy', -10)
          .text((kpi) => kpi)
          .style('text-anchor', 'middle')
          .style('font', 'bold 16px sans-serif')
          .style('fill', 'black');

      KPIBlock.append('text')
          .attr('class', 'kpi-value')
          .attr(
              'x',
              (kpi, i) => ((i + 0.5) * (this.width - KPIBlockMargin)) / KPIKeys.length,
          )
          .attr('dy', KPIHeight / 2)
          .attr('dominant-baseline', 'central')
          .text((kpi) => defaultKPIDict[kpi])
          .style('text-anchor', 'middle')
          .style('font', '20px sans-serif')
          .style('fill', 'white');
  };

  editKPI = (kpiDict) => {
      d3.selectAll('.kpi-value').text((kpi) => kpiDict[kpi]);
  };

  drawLegend = () => {
      // Legend //
      const { iconSize } = this.state;

      const resultTypes = [
          ['Win', '#416CAF'],
          ['Draw', '#DAB042'],
          ['Loss', '#D55150'],
      ];

      const legend = this.pcp
          .append('g')
          .attr('transform', `translate(0, ${this.height + 70})`)
          .attr('class', 'legend')
          .style('visibility', 'hidden');

      const legendResultItem = legend
          .selectAll('g')
          .data(resultTypes)
          .enter()
          .append('g')
          .attr('class', 'legend-item');

      legendResultItem.each((d, i, elem) => {
          const legendElem = d3.select(elem[i]);

          ['Home', 'Away'].forEach((loc, j) => {
              legendElem
                  .append('rect')
                  .attr('width', iconSize)
                  .attr('height', iconSize)
                  .attr('fill', d[1])
                  .attr('transform', `translate(${j * (iconSize + 5)}, 0)`);

              if (loc === 'Home') {
                  legendElem
                      .append('text')
                      .attr('dx', iconSize / 2)
                      .attr('dy', iconSize / 2)
                      .attr('text-anchor', 'middle')
                      .attr('dominant-baseline', 'central')
                      .style('stroke', 'none')
                      .style('fill', 'white')
                      .text('H');
              }
          });

          legendElem
              .append('text')
              .attr('x', iconSize * 2 + 10)
              .attr('dy', iconSize / 2)
              .attr('opacity', 0.4)
              .attr('dominant-baseline', 'central')
              .style('stroke', 'none')
              .style('fill', 'black')
              .text(` = ${d[0]} (home/away)`);
      });

      const legendOpponentItem = legend.append('g').attr('class', 'legend-item');

      legendOpponentItem
          .selectAll('circle')
          .data(resultTypes)
          .enter()
          .append('circle')
          .attr('cx', (d, i) => i * 12)
          .attr('cy', iconSize / 2)
          .attr('r', iconSize / 4)
          .attr('fill', (d) => d[1]);

      legendOpponentItem
          .append('text')
          .attr('x', iconSize * 2)
          .attr('dy', iconSize / 2)
          .attr('opacity', 0.4)
          .attr('dominant-baseline', 'central')
          .style('stroke', 'none')
          .style('fill', 'black')
          .text(' = Opponent');

      const legendElems = d3.selectAll('.legend-item');
      const maxElemWidth = d3.max(legendElems.nodes(), (n) => n.getBBox().width);
      const elemMargin = 20;
      const legendMargin = d3.max([
          (this.width
        - (maxElemWidth + elemMargin) * legendElems.size()
        + elemMargin)
        / 2,
          0,
      ]);

      legendElems.attr(
          'transform',
          (t, j) => `translate(${(maxElemWidth + elemMargin) * j + legendMargin}, 0)`,
      );
  };

  /**  @override */
  updateDraw = (year) => {
      const { data } = this.props;
      const { iconSize } = this.state;

      this.currentYear = year;

      this.dataYear = data[year];

      this.pcp.selectAll('*').remove();

      this.addKPI();
      this.drawLegend();

      const clubs = Object.keys(this.dataYear).filter(
          (d) => !['KPI', 'Extent'].includes(d),
      );

      this.editKPI(this.dataYear.KPI.Overall);

      const dimensionExtent = this.dataYear.Extent;
      const dimensions = Object.keys(dimensionExtent).sort((a, b) => {
          const val1 = +a.replace(/\D/, '');
          const val2 = +b.replace(/\D/, '');
          if (val1 < val2) {
              return -1;
          }
          return val1 > val2 ? 1 : 0;
      });

      // For each dimension, I build a linear scale. I store all in a y object
      this.y = {};

      dimensions.forEach((key) => {
          this.y[key] = d3
              .scaleLinear()
              .domain(dimensionExtent[key])
              .range([this.height, 0]);
      });

      // Build the X scale -> it finds the best position for each Y axis
      this.x = d3.scalePoint().range([0, this.width]).domain(dimensions);

      // Path function for each club
      this.path = (club) => d3.line().curve(d3.curveMonotoneX)(
          this.dataYear[club].map((d) => [
              this.x(d.Match),
              this.y[d.Match](d['Points accumulated']),
          ]),
      );

      // Draw the lines
      const lines = this.pcp.append('g').attr('id', 'lines');

      lines
          .selectAll('path')
          .data(clubs)
          .enter()
          .append('path')
          .attr('id', (club) => `line-${club.replace(/[^\w]/gi, '')}`) // 2 class for each line: 'line' and the group name
          .attr('class', 'line selector')
          .attr('d', this.path)
          .style('fill', 'none')
          .style('stroke-width', 3)
          .style('stroke', (club) => this.color(club))
          .on('mouseover', (event, d) => this.addHighlight(d))
          .on('mouseout', (event, d) => this.removeHighlight(d))
          .on('click', (event, d) => this.showClubResults(d));

      // Draw the axes
      const axes = this.pcp
          .append('g')
          .attr('id', 'axes')
          .selectAll('axis')
      // For each dimension of the dataset I add a 'g' element:
          .data(dimensions)
          .enter()
          .append('g')
          .attr('class', 'axis')
      // I translate this element to its right position on the x axis
          .attr('transform', (d) => `translate(${this.x(d)})`)
      // And I build the axis with the call function
          .each((d, i, elem) => d3.select(elem[i]).call(d3.axisLeft().scale(this.y[d]).ticks(0)));

      // Add axis title
      axes
          .append('text')
          .style('text-anchor', 'middle')
          .attr('dy', -50)
          .text((d) => d)
          .style('fill', 'black');

      axes
          .append('text')
          .style('text-anchor', 'middle')
          .attr('dy', -37)
          .text((d) => dimensionExtent[d][1])
          .style('fill', 'black');

      axes
          .append('text')
          .style('text-anchor', 'middle')
          .attr('y', this.height)
          .attr('dy', 45)
          .text((d) => dimensionExtent[d][0])
          .style('fill', 'black');

      const labels = this.pcp
          .append('g')
          .attr('id', 'labels')
          .attr('transform', `translate(${this.width + 45}, 0)`);

      labels
          .append('text')
          .attr('id', 'label-match')
          .attr('y', '-50')
          .attr('opacity', 0.8)
          .text('Match #');

      labels
          .append('text')
          .attr('id', 'label-rank')
          .attr('y', '-70')
          .text('Rank')
          .style('visibility', 'hidden');

      this.pcp
          .append('clipPath')
          .attr('id', 'clipObj')
          .append('circle')
          .attr('cx', iconSize / 2)
          .attr('cy', iconSize / 2)
          .attr('r', iconSize / 2);

      const finalPoints = {};
      const lastDimension = dimensions.slice(-1)[0];

      clubs.forEach((club) => {
          finalPoints[club] = d3.max(
              this.dataYear[club].map((d) => d['Points accumulated']),
          );
      });

      const iconsY = this.pcp
          .append('g')
          .attr('id', 'y-icons')
          .selectAll('image')
          .data(clubs)
          .enter()
          .append('g')
          .attr('class', 'icon-group')
          .attr(
              'transform',
              (club) => `translate(${this.width + 45}, ${this.y[lastDimension](
                  finalPoints[club],
              )})`,
          );

      iconsY
          .append('image')
          .attr('id', (club) => `club-${club.replace(/[^\w]/gi, '')}`)
          .attr('class', 'icon selector')
          .attr('xlink:href', (club) => toIcon(club))
          .attr('width', iconSize)
          .attr('height', iconSize)
          .attr('transform', `translate(0, ${-iconSize / 2})`)
      // .attr('clip-path', 'url(#clipObj)')
          .attr('opacity', '.6')
          .on('mouseover', (event, d) => this.addHighlight(d))
          .on('mouseout', (event, d) => this.removeHighlight(d))
          .on('click', (event, d) => this.showClubResults(d));

      iconsY
          .append('text')
          .attr('class', 'icon text')
          .attr('dy', '.35em')
          .attr('dx', 30)
          .style('font', '10px sans-serif')
          .text((club) => `${finalPoints[club]}p.`);

      const clubsSorted = clubs.sort((a, b) => {
          const val1 = this.dataYear[a].slice(-1)[0]['Points accumulated'];
          const val2 = this.dataYear[b].slice(-1)[0]['Points accumulated'];

          if (val1 < val2) {
              return 1;
          }
          return val1 > val2 ? -1 : 0;
      });

      const iconsX = this.pcp
          .append('g')
          .attr('id', 'x-icons')
          .selectAll('image')
          .data(clubsSorted)
          .enter()
          .append('g')
          .attr('class', 'icon-group')
          .attr(
              'transform',
              (club, i) => `translate(${(i * this.width) / clubs.length}, -125)`,
          );

      iconsX
          .append('image')
          .attr('id', (club) => `club-${club.replace(/[^\w]/gi, '')}`)
          .attr('class', 'icon selector')
          .attr('xlink:href', (club) => toIcon(club))
          .attr('width', iconSize * 2)
          .attr('height', iconSize * 2)
          .on('mouseover', (event, d) => this.addHighlight(d))
          .on('mouseout', (event, d) => this.removeHighlight(d))
          .on('click', (event, d) => this.showClubResults(d));

      iconsX
          .append('text')
          .attr('class', 'icon text')
          .attr('dy', -10)
          .attr('dx', iconSize)
          .attr('text-anchor', 'middle')
          .style('font', '10px sans-serif')
          .text((club) => club);

      if (Object.keys(this.dataYear).includes(this.focusClub)) {
          this.showClubResults(this.focusClub);
      }
  };

  addHighlight = (club) => {
      if (d3.selectAll('.focus').size() !== 0) {
          return;
      }

      const otherLines = d3.selectAll('#lines .line').filter((c) => c !== club);

      d3.select(`#line-${club.replace(/[^\w]/gi, '')}`)
          .transition()
          .duration(500)
          .attr('opacity', 1)
          .style('stroke-width', 4);

      otherLines
          .transition()
          .duration(500)
          .attr('opacity', 0.15)
          .style('stroke-width', 2);
  };

  removeHighlight = (club) => {
      if (d3.selectAll('.focus').size() !== 0) {
          return;
      }

      const otherLines = d3.selectAll('#lines .line').filter((c) => c !== club);

      d3.select(`#line-${club.replace(/[^\w]/gi, '')}`)
          .transition()
          .duration(500)
          .attr('opacity', 1)
          .style('stroke-width', 2);

      otherLines
          .transition()
          .duration(500)
          .attr('opacity', 1)
          .style('stroke-width', 2);
  };

  drawResultBlocks = (club) => {
      const { iconSize } = this.state;

      const block = this.pcp
          .selectAll('.result-block')
          .data(this.dataYear[club])
          .enter()
          .append('g')
          .attr('class', 'result-block');

      block
          .append('rect')
          .attr('x', (d) => this.x(d.Match))
          .attr('y', (d) => this.y[d.Match](d['Points accumulated']))
          .attr('width', iconSize)
          .attr('height', iconSize)
          .attr('transform', (d) => `translate(${-iconSize / 2},${-iconSize / 2})`)
          .attr('fill', (d) => {
              if (d.Points > 1) {
                  return '#416CAF';
              }
              if (d.Points === 1) {
                  return '#DAB042';
              }
              return '#D55150';
          });

      block
          .append('text')
          .attr('x', (d) => this.x(d.Match))
          .attr('y', (d) => this.y[d.Match](d['Points accumulated']))
          .attr('dy', '.35em')
          .attr('text-anchor', 'middle')
          .style('stroke', 'none')
          .style('fill', 'white')
          .text((d) => (d.Location === 'Home' ? 'H' : ''));
  };

  drawRankChange = (club) => {
      const clubData = this.dataYear[club];

      clubData.forEach((d, i) => {
          if (i > 0) {
              d3.selectAll(`.rank-change #${d.Match}`).remove();

              const currentRank = d.Rank;
              const previousRank = clubData[i - 1].Rank;
              const rankChange = this.pcp
                  .append('g')
                  .attr('class', 'rank-change')
                  .attr('id', d.Match);

              if (currentRank > previousRank) {
                  rankChange
                      .append('path')
                      .attr('d', `m ${this.x(d.Match)} -75 l 10 0 l -5 10`)
                      .attr('transform', 'translate(-10, 0)')
                      .style('fill', 'black');
              } else if (currentRank < previousRank) {
                  rankChange
                      .append('path')
                      .attr('d', `m ${this.x(d.Match)} -65 l 10 0 l -5 -10`)
                      .attr('transform', 'translate(-10, 0)')
                      .style('fill', 'black');
              }

              if (currentRank !== previousRank) {
                  rankChange
                      .append('text')
                      .attr('x', this.x(d.Match))
                      .attr('y', -70)
                      .attr('dx', 1)
                      .attr('dy', '.35em')
                      .attr('text-anchor', 'left')
                      .style('stroke', 'none')
                      .style('fill', 'black')
                      .text(d.Rank);
              }
          }
      });
  };

  drawResultLinks = (club) => {
      const { iconSize } = this.state;

      const opponentPoints = this.dataYear[club].map((d) => {
          const opponent = d.Against;
          return this.dataYear[opponent].filter((t) => t.Match === d.Match)[0][
              'Points accumulated'
          ];
      });

      const link = this.pcp
          .selectAll('.result-link')
          .data(this.dataYear[club])
          .enter()
          .append('g')
          .attr('class', 'result-link');

      // Add lines
      link
          .append('path')
          .attr('class', 'result-line')
          .attr(
              'd',
              (d, i) => `M ${this.x(d.Match)} ${this.y[d.Match](
                  d['Points accumulated'],
              )} L ${this.x(d.Match)} ${this.y[d.Match](opponentPoints[i])}`,
          )
          .attr('stroke-dasharray', 8)
          .attr('stroke', '#a0a0a0')
          .attr('fill', 'none')
          .style('stroke-width', 3);

      // Add points
      link
          .append('circle')
          .attr('class', 'result-point')
          .attr('cx', (d) => this.x(d.Match))
          .attr('cy', (d, i) => this.y[d.Match](opponentPoints[i]))
          .attr('r', iconSize / 4)
          .attr('fill', (d) => {
              if (d.Points > 1) {
                  return '#416CAF';
              }
              if (d.Points === 1) {
                  return '#DAB042';
              }
              return '#D55150';
          });

      // Add score
      link
          .append('text')
          .attr('class', 'result-score')
          .attr('x', (d) => this.x(d.Match))
          .attr('y', (d, i) => this.y[d.Match](opponentPoints[i]))
          .attr('text-anchor', 'middle')
          .attr('transform', (d, i) => {
              if (opponentPoints[i] < d['Points accumulated']) {
                  return `translate(0,${3})`;
              }
              if (opponentPoints[i] === d['Points accumulated']) {
                  return `translate(0,${10})`;
              }
              return `translate(0,${-35})`;
          })
          .style('font', '11px sans-serif')
          .style('font-weight', 'bold')
          .style('vertical-baseline', 'middle')
          .style('stroke', 'none')
          .style('fill', 'black')
          .text((d, i) => {
              if (opponentPoints[i] <= d['Points accumulated']) {
                  return `${d.Score}\n${d.Against}`;
              }
              return `${d.Against}\n${d.Score}`;
          })
          .call(this.wrap, 0); // wrap the text
  };

  showClubResults = (club) => {
      this.focusClub = club;

      d3.selectAll('.result-block').remove();
      d3.selectAll('.result-link').remove();
      d3.selectAll('.rank-change').remove();

      const selectors = d3.selectAll('.selector');
      const icons = d3.selectAll('.icon');

      const markedIcon = icons.filter((c) => c === club).attr('opacity', 1);
      const otherIcons = icons.filter((c) => c !== club);

      const lines = d3.selectAll('.line');

      const markedLine = lines.filter((c) => c === club).classed('hidden', false);
      const otherLines = lines.filter((c) => c !== club).classed('focus', false);

      // Apply focus

      markedLine.raise(); // bring line to front
      markedLine.classed('focus', true);

      otherIcons.attr('opacity', 0.3);
      otherLines.classed('hidden', true);

      this.drawResultLinks(club);
      this.drawResultBlocks(club);
      this.drawRankChange(club);

      this.editKPI(this.dataYear.KPI[club]);
      d3.select('.legend').style('visibility', 'visible');
      d3.select('#label-rank').style('visibility', 'visible');

      d3.select(d3.select('#main-pcp-canvas').node().parentNode).on(
          'click',
          (event) => {
              const outside = selectors
                  .filter((d, i, elem) => elem[i] === event.target)
                  .empty();

              // console.log(d3.event.target);
              // console.log(outside);
              // console.log(icons);
              // console.log(d3.select('.icon').node());

              if (outside) {
                  // Remove focus
                  this.focusClub = null;

                  d3.selectAll('.result-block').remove();
                  d3.selectAll('.result-link').remove();
                  d3.selectAll('.rank-change').remove();

                  markedLine.classed('focus', false);

                  this.removeHighlight(club);

                  otherIcons.attr('opacity', 1);
                  otherLines.classed('hidden', false);

                  this.editKPI(this.dataYear.KPI.Overall);

                  d3.select('.legend').style('visibility', 'hidden');
                  d3.select('#label-rank').style('visibility', 'hidden');
              }
          },
      );
  };

  wrap = (text, width) => {
      text.each((d, i, elem) => {
          const txt = d3.select(elem[i]);
          const words = txt.text().split(/\n/).reverse();
          let line = [];
          let lineNumber = 0;
          const lineHeight = 1.1; // ems
          const x = txt.attr('x');
          const y = txt.attr('y');
          const dy = 0; // parseFloat(text.attr("dy")),
          let tspan = txt
              .text(null)
              .append('tspan')
              .attr('x', x)
              .attr('y', y)
              .attr('dy', `${dy}em`);
          // eslint-disable-next-line no-restricted-syntax
          words.forEach((word) => {
              line.push(word);
              tspan.text(line.join(' '));
              if (tspan.node().getComputedTextLength() > width) {
                  line.pop();
                  tspan.text(line.join(' '));
                  line = [word];
                  tspan = txt
                      .append('tspan')
                      .attr('x', x)
                      .attr('y', y)
                  // eslint-disable-next-line no-plusplus
                      .attr('dy', `${++lineNumber * lineHeight + dy}em`)
                      .text(word);
              }
          });
      });
  };
}
