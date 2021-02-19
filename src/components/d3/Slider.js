import * as d3Base from 'd3';
import { sliderBottom } from 'd3-simple-slider';
import * as PropTypes from 'prop-types';
import D3Component from './D3Component';

const d3 = Object.assign(d3Base, { sliderBottom });

export default class Slider extends D3Component {
  static propTypes = {
      minYear: PropTypes.number.isRequired,
      maxYear: PropTypes.number.isRequired,
      stepSize: PropTypes.number.isRequired,
      selectedYear: PropTypes.number.isRequired,
      setSelectedYear: PropTypes.func.isRequired,
  };

  static margin = {
      left: 40,
      right: 40,
      top: 40,
      bottom: 40,
  };

  constructor(props) {
      super(props);
      this.state = {
          tickFormat: d3.format('.0f'),
      };
  }

  /** @override */
  firstDraw = (svg, width, height) => {
      const {
          minYear,
          maxYear,
          selectedYear,
          stepSize,
          setSelectedYear,
      } = this.props;
      const { tickFormat } = this.state;
      const sliderWidth = width - Slider.margin.left - Slider.margin.right;

      const sliderTrack = svg
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr(
              'transform',
              `translate(${Slider.margin.left},${Slider.margin.top})`,
          );

      this.scaleSlider = d3
          .scaleLinear()
          .domain([minYear, maxYear])
          .range([0, sliderWidth]);

      // Step
      const sliderStep = d3
          .sliderBottom()
          .min(minYear)
          .max(maxYear)
          .width(sliderWidth)
          .tickFormat(tickFormat)
          .ticks(width / 50)
          .step(stepSize)
          .default(selectedYear)
          .handle(d3.symbol().type(d3.symbolCircle).size(200)())
          .on('onchange', (val) => {
              setSelectedYear(val);
          });

      // Add slider
      sliderTrack.call(sliderStep);

      this.updateDraw(svg, width, height);
  };

  /** @override */
  updateDraw = () => {
      const { selectedYear } = this.props;
      const { tickFormat } = this.state;

      d3.select('.parameter-value')
          .attr('transform', `translate(${this.scaleSlider(selectedYear)}, 0)`)
          .select('text')
          .text(tickFormat(selectedYear));
      d3.selectAll('#sld-track text').attr('opacity', 1);
  };
}
