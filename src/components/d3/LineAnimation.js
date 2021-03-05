import * as d3 from 'd3';
import * as PropTypes from 'prop-types';
import D3Component from './D3Component';
import './LineAnimation.scss';
import { lightBlue } from '../../theme';
import getRandomColor from '../../utils/getRandomColor';

export default class LineAnimation extends D3Component {
  static propTypes = {
      animationDuration: PropTypes.any.isRequired,
      active: PropTypes.any.isRequired,
  };

  constructor(props) {
      super(props);
      this.state = {
          marginRel: {
              top: 10,
              right: 15,
              bottom: 10,
              left: 10,
          },
          axisMargin: 10,
          plotted: false,
      };
  }

  plotLine = (svg, width, height) => {
      // Data

      const { axisMargin, marginRel } = this.state;
      const { animationDuration } = this.props;

      const margin = {
          top: (marginRel.top / 100) * height,
          right: (marginRel.right / 100) * width,
          bottom: (marginRel.bottom / 100) * height,
          left: (marginRel.left / 100) * width,
      };

      this.width = width - margin.left - margin.right;
      this.height = height - margin.top - margin.bottom;

      const nDataPoints = 20;
      const data = Array.from({ length: nDataPoints }, () => Math.floor(Math.random() * 11));

      // Set-up main canvas

      const main = svg
          .append('g')
          .attr('id', 'lineAnimation')
          .attr('width', this.width)
          .attr('height', this.height)
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Scalers

      const x = d3
          .scaleLinear()
          .domain([0, nDataPoints - 1])
          .range([axisMargin, this.width - axisMargin]);

      const y = d3
          .scaleLinear()
          .domain([0, 10])
          .range([this.height - axisMargin, axisMargin]);

      const line = d3
          .line()
          .curve(d3.curveNatural)
          .x((d, i) => x(i))
          .y((d) => y(d));

      // Axes

      main
          .append('g')
          .attr('class', 'axis axis-x')
          .attr('transform', `translate(0,${this.height})`)
          .call(d3.axisBottom(x));

      main.append('g').attr('class', 'axis axis-y').call(d3.axisLeft(y));

      // Line
      const path = main
          .append('path')
          .attr('class', 'line')
          .attr('d', line(data))
          .attr('stroke-width', '3px')
          .attr('fill', 'none');

      // Scatterplot
      main
          .selectAll('.dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('class', 'dot')
          .attr('r', 4)
          .attr('cx', (d, i) => x(i))
          .attr('cy', (d) => y(d))
          .style('stroke-width', '1.5px')
          .style('fill', 'white')
          .style('stroke', 'white')
          .transition()
          .duration((d, i) => (animationDuration / nDataPoints) * i)
          .ease(d3.easeExpIn)
          .style('stroke', `${lightBlue}`);

      // Animation
      const totalLength = path.node().getTotalLength();

      path
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(animationDuration)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0);

      // Restart
      const restartButton = main.append('g').attr('class', 'restart-button');

      const buttonWidth = 40;
      const buttonHeight = 20;
      const buttonOffset = margin.right / 4;

      restartButton
          .append('rect')
          .attr('class', 'restart-block')
          .attr('x', this.width + buttonOffset)
          .attr('y', this.height / 2 - buttonHeight / 2)
          .attr('rx', 6)
          .attr('ry', 6)
          .attr('width', buttonWidth)
          .attr('height', buttonHeight)
          .style('fill', `${lightBlue}`);

      restartButton
          .append('text')
          .attr('class', 'restart-text')
          .attr('x', this.width + buttonOffset + buttonWidth / 2)
          .attr('y', this.height / 2)
          .text('Restart')
          .attr('dominant-baseline', 'central')
          .style('text-anchor', 'middle')
          .style('font', '10px sans-serif')
          .style('fill', 'white');

      // Events
      d3.selectAll('.dot')
          .on('mouseover', (event) => {
              d3.select(event.currentTarget)
                  .transition()
                  .duration(500)
                  .style('fill', getRandomColor());
          })
          .on('mouseout', (event) => {
              d3.select(event.currentTarget)
                  .transition()
                  .duration(500)
                  .style('fill', 'white');
          });

      restartButton.on('click', this.updateDimensions);
  };

  /** @override   */
  updateDimensions = () => {
      // Clear content
      const { id } = this;
      // eslint-disable-next-line
    const svg = document.getElementById(id);
      if (svg) {
          svg.innerHTML = '';
      }
      // reset plotted state
      this.setState({ plotted: false });

      // Redraw
      this.updateDrawWrapper();
  };

  /** @override   */
  firstDraw = () => {};

  /**  @override */
  updateDraw = (svg, width, height) => {
      const { active } = this.props;
      const { plotted } = this.state;

      if (active && !plotted) {
          this.setState({ plotted: true });
          this.plotLine(svg, width, height);
      }
  };
}
