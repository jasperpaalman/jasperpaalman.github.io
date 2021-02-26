import * as d3 from 'd3';
import * as PropTypes from 'prop-types';
import D3Component from './D3Component';
import './NeuralNetworkAnimation.scss';
import { lightBlue } from '../../theme';

export default class NeuralNetworkAnimation extends D3Component {
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
          plotted: false,
      };
  }

  CircleGenerator = d3.line().curve(d3.curveCardinal);

  LineGenerator = d3.line().curve(d3.curveLinear);

  makeArr = (startValue, stopValue, cardinality) => {
      const arr = [];
      const currValue = startValue;
      const step = (stopValue - startValue) / (cardinality - 1);
      for (let i = 0; i < cardinality; i += 1) {
          arr.push(currValue + step * i);
      }
      return arr;
  };

  getCirclePath = (cx, cy, r) => {
      const angles = this.makeArr(0, 360 * 4, 30);

      const points = angles.map((angle) => {
          const X = cx + r * Math.cos(angle);
          const Y = cy + r * Math.sin(angle);

          return [X, Y];
      });

      const pathData = this.CircleGenerator(points);

      return pathData;
  };

  getYposition = (n) => {
      const positions = [...Array(n).keys()];

      const yPos = positions.map((t) => (t * this.height) / (n - 1));

      return yPos;
  };

  plotNetwork = (svg, width, height) => {
      const { marginRel } = this.state;

      const margin = {
          top: (marginRel.top / 100) * height,
          right: (marginRel.right / 100) * width,
          bottom: (marginRel.bottom / 100) * height,
          left: (marginRel.left / 100) * width,
      };

      const { animationDuration } = this.props;

      // randomly generated N = 40 length array 0 <= A[N] <= 39
      const layerNodes = Array.from(
          { length: 5 },
          () => Math.floor(Math.random() * 5) + 2,
      );

      const radius = height / 15;

      this.width = width - margin.left - margin.right;
      this.height = height - margin.top - margin.bottom;

      const spacing = this.width / (layerNodes.length - 1);

      const main = svg
          .append('g')
          .attr('id', 'networkAnimation')
          .attr('width', this.width)
          .attr('height', this.height)
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const layers = main
          .selectAll('g')
          .data(layerNodes)
          .enter()
          .append('g')
          .attr('transform', (d, i) => `translate(${i * spacing},0)`);

      layers.each((layerData, i, elem0) => {
          const layer = d3.select(elem0[i]);

          const yPosCurrent = this.getYposition(layerData);
          const yPosNext = this.getYposition(layerNodes[i + 1]);

          const nodes = layer
              .selectAll('.node')
              .data(yPosCurrent)
              .enter()
              .append('path')
              .attr('class', 'node')
              .attr('d', (t) => this.getCirclePath(0, t, radius))
              .attr('stroke-width', '2')
              .style('fill-opacity', 0);

          nodes.each((nodeData, j, elem1) => {
              const path = d3.select(elem1[j]);

              const totalLength = path.node().getTotalLength();

              path
                  .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                  .attr('stroke-dashoffset', totalLength)
                  .transition()
                  .duration(animationDuration / 2)
                  .delay(i * animationDuration * 2)
                  .ease(d3.easeLinear)
                  .attr('stroke-dashoffset', 0);

              path
                  .transition()
                  .duration(animationDuration / 2)
                  .delay(i * animationDuration * 2 + 0.5 * animationDuration)
                  .style('fill-opacity', 0.8);
          });

          if (i + 1 !== layerNodes.length) {
              const links = [];

              yPosCurrent.forEach((currentY) => {
                  yPosNext.forEach((nextY) => {
                      links.push([
                          [0, currentY],
                          [spacing, nextY],
                      ]);
                  });
              });

              const lines = layer
                  .selectAll('.line')
                  .data(links)
                  .enter()
                  .append('path')
                  .attr('class', 'line')
                  .attr('d', (t) => this.LineGenerator(t))
                  .attr('stroke-width', '2')
                  .style('fill-opacity', 0);

              lines.each((lineData, k, elem2) => {
                  const path = d3.select(elem2[k]);

                  const totalLength = path.node().getTotalLength();

                  path
                      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                      .attr('stroke-dashoffset', totalLength)
                      .transition()
                      .duration(
                          (Math.random() * (0.15 - 0.99) + 0.99).toFixed(4)
                * animationDuration,
                      )
                      .delay(i * animationDuration * 2 + animationDuration)
                      .ease(d3.easeLinear)
                      .attr('stroke-dashoffset', 0);
              });
          }
      });

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
          this.plotNetwork(svg, width, height);
      }
  };
}
