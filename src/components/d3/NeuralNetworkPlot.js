import * as d3 from 'd3';
import * as PropTypes from 'prop-types';
import D3Component from './D3Component';
import './NeuralNetworkPlot.scss';

export default class NeuralNetworkPlot extends D3Component {
  static propTypes = {
      radius: PropTypes.any.isRequired,
      layerNodes: PropTypes.any.isRequired,
      animationDuration: PropTypes.any.isRequired,
  };

  constructor(props) {
      super(props);
      this.state = {
          margin: {
              top: 40,
              right: 150,
              bottom: 40,
              left: 150,
          },
          active: false,
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
      const { margin } = this.state;
      const { radius, layerNodes, animationDuration } = this.props;

      this.width = width - margin.left - margin.right;
      this.height = height - margin.top - margin.bottom;

      const spacing = this.width / (layerNodes.length - 1);

      const main = svg
          .append('g')
          .attr('id', 'network')
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
  };

  /** @override   */
  firstDraw = () => {};

  /**  @override */
  updateDraw = (svg, width, height) => {
      const { active } = this.state;
      if (active) {
          this.plotNetwork(svg, width, height);
      }
  };
}
