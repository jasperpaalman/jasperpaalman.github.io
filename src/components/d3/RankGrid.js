import * as d3 from 'd3';
import * as PropTypes from 'prop-types';
import D3Component from './D3Component';
import './RankGrid.scss';
import toIcon from '../../utils/toIcon';

export default class TimeLine extends D3Component {
  static propTypes = {
      data: PropTypes.any.isRequired,
      years: PropTypes.any.isRequired,
  };

  constructor(props) {
      super(props);
      this.state = {
          entryMargin: 0.3,
          axisMargin: 20,
          maxRank: 18,
          margin: {
              left: 50,
              top: 70,
              right: 40,
              bottom: 40,
          },
          hasSelection: false,
      };
  }

  /** @override   */
  firstDraw = (svg, width, height) => {
      const { data, years } = this.props;
      const {
          entryMargin, maxRank, axisMargin, margin,
      } = this.state;

      this.width = width;
      this.height = height;

      const dropdownOptions = [
          ...new Set(years.map((year) => data[year].map((t) => t.Club)).flat()),
      ].sort();

      // add the options to the button
      const selector = d3.select('#rank-dropdown');

      selector
          .selectAll('option')
          .data(dropdownOptions)
          .enter()
          .append('option')
          .text((d) => d) // text showed in the menu
          .attr('value', (d) => d); // corresponding value returned by the button

      selector.on('change', (event) => {
          this.selectionToggle({ Club: event.currentTarget.value });
      });

      this.plotwidth = width - margin.left - margin.right;
      this.entrySize = this.plotwidth / years.length - entryMargin;
      this.plotheight = maxRank * (this.entrySize + entryMargin) - entryMargin;

      const tickFormat = d3.format('.0f');

      const grid = svg
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`)
          .attr('class', 'rank-grid');

      grid
          .append('clipPath')
          .attr('id', 'clipObj')
          .append('circle')
          .attr('cx', this.entrySize / 2)
          .attr('cy', this.entrySize / 2)
          .attr('r', this.entrySize / 2);

      this.xGrid = d3
          .scaleLinear()
          .range([0, this.plotwidth - axisMargin])
          .domain([d3.min(years), d3.max(years)]);

      this.yGrid = d3
          .scaleLinear()
          .range([0, this.plotheight])
          .domain([1, maxRank]);

      const xAxis = d3
          .axisBottom()
          .scale(this.xGrid)
          .ticks(this.plotwidth / 50)
          .tickFormat(tickFormat);

      const yAxis = d3.axisLeft().scale(this.yGrid).ticks(maxRank);

      // X Axis
      grid
          .append('g')
          .attr(
              'transform',
              `translate(${axisMargin},${this.plotheight + axisMargin})`,
          )
          .call(xAxis);

      grid
          .append('text')
          .attr('x', this.plotwidth)
          .attr('y', this.plotheight + axisMargin + 40)
          .attr('text-anchor', 'end')
          .style('font', '14px sans-serif')
          .text('Year');

      // Y Axis
      grid.append('g').call(yAxis);

      grid
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('dy', -30)
          .attr('text-anchor', 'end')
          .style('font', '14px sans-serif')
          .text('Final rank');

      this.dotGroup = grid.append('g');

      const resetButton = this.dotGroup
          .append('g')
          .attr('id', 'reset-button')
          .attr('transform', `translate(${this.width / 2}, -60)`)
          .style('visibility', 'hidden')
          .on('click', () => {
              d3.select('#reset-button').style('visibility', 'hidden');
              this.deselectClub();
          });

      resetButton
          .append('rect')
          .attr('width', 50)
          .attr('height', 20)
          .attr('transform', 'translate(-25, 0)')
          .style('fill', '#e61d49');

      resetButton
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('transform', 'translate(0, 10)')
          .style('font', '12px sans-serif')
          .style('fill', 'white')
          .text('Reset');

      years.forEach((year) => {
          this.dotGroup
              .append('g')
              .attr('class', 'grid-column')
              .attr('id', `year-${year}`)
              .attr('transform', `translate(${this.xGrid(year) + axisMargin},0)`);
      });

      years.forEach((year) => this.renderYear(year));

      // this.updateDraw();
  };

  /**  @override */
  updateDraw = () => {};

  renderYear = (year) => {
      const { data } = this.props;
      const { axisMargin } = this.state;
      const yearData = data[year];

      const yearSvg = this.dotGroup
          .select(`#year-${year}`)
          .selectAll('g')
          .data(yearData);

      yearSvg
          .enter()
          .append('image')
          .attr('class', 'grid-entry')
          .attr('id', (d) => `club-${d.Club.replace(/[^\w]/gi, '')}`)
          .attr('xlink:href', (d) => toIcon(d.Club))
          .attr('width', this.entrySize)
          .attr('height', this.entrySize)
          .attr(
              'transform',
              (d) => `translate(${-(this.entrySize / 2)},
                            ${
                              this.yGrid(d['Season rank']) - this.entrySize / 2
                            })`,
          )
          .on('click', (event, d) => this.selectionToggle(d))
          .on('mouseover', (d) => (this.dotGroup.selectAll('.grid-bar').empty()
              ? this.addClubLabel(d)
              : null))
          .on('mouseout', () => (this.dotGroup.selectAll('.grid-bar').empty()
              ? this.dotGroup.selectAll('.grid-text').remove()
              : null));
  };

  addClubLabel = (d) => {
      this.dotGroup
          .append('text')
          .attr('class', 'grid-text')
          .attr('transform', `translate(${this.width / 2},-20)`)
          .attr('text-anchor', 'middle')
          .style('font', 'bold 16px sans-serif')
          .style('fill', 'black')
          .text(d.Club);
  };

  selectionToggle = (d) => {
      const { hasSelection } = this.state;
      d3.select('#reset-button').style('visibility', 'visible');

      if (hasSelection) {
          this.deselectClub();
      }
      this.selectClub(d);
  };

  selectClub = (d) => {
      const { axisMargin } = this.state;

      this.dotGroup
          .selectAll(`#club-${d.Club.replace(/[^\w]/gi, '')}`)
          .each((g, i, elem) => {
              d3.select(elem[i].parentNode)
                  .append('path')
                  .attr('class', 'grid-bar')
                  .attr(
                      'd',
                      `m 0 ${this.yGrid(g['Season rank'])} 
                    l 0 ${
                      this.plotheight
                      - this.yGrid(g['Season rank'])
                      + axisMargin
                    }`,
                  )
                  .style('stroke', 'steelblue')
                  .style('stroke-width', this.entrySize - 2)
                  .attr('opacity', 0.4);
          });

      this.dotGroup
          .selectAll('.grid-entry')
          .raise()
          .filter((t) => d.Club !== t.Club)
          .attr('opacity', 0.2);

      this.addClubLabel(d);

      this.setState({ hasSelection: true });
  };

  deselectClub = () => {
      // console.log('deselect club');
      this.dotGroup.selectAll('.grid-entry').attr('opacity', 1);

      this.dotGroup.selectAll('.grid-bar').remove();
      this.dotGroup.selectAll('.grid-text').remove();

      this.setState({ hasSelection: false });
  };
}
