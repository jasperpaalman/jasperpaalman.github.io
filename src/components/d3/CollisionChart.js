import React from 'react';
import * as d3 from 'd3';
import D3Component from './D3Component';

export default class CollisionChart extends D3Component {
  // Drawing function for nodes
  ticked = (context, nodes, color) => {
      const width = this.getWidth();
      const height = this.getHeight();

      // Clear canvas
      context.clearRect(0, 0, width, height);
      context.save();
      // Move to center
      context.translate(width / 2, height / 2);

      Object.keys(nodes).forEach((key) => {
          const d = nodes[key];
          // Create cirlce
          context.beginPath();
          context.moveTo(d.x + d.r, d.y);
          context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
          context.fillStyle = color(d.group);
          context.fill();
      });

      context.restore();
  };

  plotChart = (canvas, width, height) => {
      // Get context
      const context = canvas.getContext('2d');

      // Number of colors
      const nColors = 4;

      // Create color range
      const color = d3.scaleOrdinal(
          d3.range(nColors),
          ['transparent'].concat(d3.schemeBlues[nColors]),
      );

      // Create radius range
      const k = Math.min(width, height) / 10;
      const r = d3.randomUniform(k, k * 4);

      // Create nodes
      const nNodes = 300;
      const data = Array.from({ length: nNodes }, (_, i) => ({
          r: r(),
          group: i && (i % nColors) + 1,
      }));
      const nodes = data.map(Object.create);

      // Force simulation function
      const simulation = d3
          .forceSimulation(nodes)
          .alphaTarget(0.3) // stay hot
          .velocityDecay(0.1) // low friction
          .force('x', d3.forceX().strength(0.005))
          .force('y', d3.forceY().strength(0.005))
          .force(
              'collide',
              d3
                  .forceCollide()
                  .radius((d) => d.r + 1)
                  .iterations(3),
          )
          .force(
              'charge',
              d3.forceManyBody().strength((d, i) => (i ? 0 : (-width * 2) / 3)),
          )
          .on('tick', () => this.ticked(context, nodes, color));

      // Move nodes by moving mouse
      function pointed(event) {
          const [x, y] = d3.pointer(event);
          nodes[0].fx = x - width / 2;
          nodes[0].fy = y - height / 2;
      }

      // Draw canvas, apply pointer
      d3.select(canvas)
          .attr('width', width)
          .attr('height', height)
          .on('touchmove', (event) => event.preventDefault())
          .on('pointermove', pointed);
  };

  /** @override   */
  updateDimensions = () => {
      const { id } = this;
      const canvas = document.getElementById(id);
      canvas.width = this.getWidth();
      canvas.height = this.getHeight();
  };

  /** @override   */
  firstDraw = (canvas, width, height) => this.plotChart(canvas.node(), width, height);

  /**  @override */
  updateDraw = (canvas, width, height) => {};

  /**  @override */
  render = () => {
      const { id, myRef } = this;
      const { style } = this.props;
      return (
          <canvas id={id} style={{ overflow: 'visible', ...style }} ref={myRef} />
      );
  };
}
