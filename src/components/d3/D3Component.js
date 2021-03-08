import React, { PureComponent } from 'react';
import * as d3 from 'd3';
import * as PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export default class D3Component extends PureComponent {
  static propTypes = {
      style: PropTypes.any,
  };

  static defaultProps = {
      style: null,
  };

  constructor(props) {
      super(props);
      const randomString = uuidv4();
      this.id = `svg-container-${randomString}`;
      this.myRef = React.createRef();
      this.state = {
          width: null,
          height: null,
      };
  }

  componentDidMount = () => {
      this.firstDrawWrapper();

      // Update width and height
      this.updateStateSize();

      // eslint-disable-next-line no-undef
      window.addEventListener('resize', this.updateDimensionsWrapper);
  };

  componentDidUpdate = () => {
      this.delayedUpdate();
  };

  componentWillUnmount = () => {
      // eslint-disable-next-line no-undef
      window.removeEventListener('resize', this.updateDimensionsWrapper);
  };

  updateStateSize = () => {
      this.setState({
          width: this.getWidth(),
          height: this.getHeight(),
      });
  };

  getHeight = () => {
      const { myRef } = this;
      return myRef.current.clientHeight;
  };

  getWidth = () => {
      const { myRef } = this;
      return myRef.current.clientWidth;
  };

  updateDimensionsWrapper = () => {
      // Check if dimensions are truly changed
      // (Mobile chrome triggers resize on scroll)
      const { width, height } = this.state;

      if (width !== this.getWidth() || height !== this.getHeight()) {
          this.updateStateSize();
          this.updateDimensions();
      }
  };

  updateDimensions = () => {
      // Clear content
      const { id } = this;
      // eslint-disable-next-line
    const svg = document.getElementById(id);
      if (svg) {
          svg.innerHTML = '';
      }

      // Redraw everything
      this.firstDrawWrapper();
  };

  delayedUpdate = () => {
      new Promise(() => this.updateDrawWrapper()).then();
  };

  firstDrawWrapper = () => {
      const { id } = this;
      const svg = d3.select(`#${id}`);

      this.firstDraw(svg, this.getWidth(), this.getHeight());
  };

  updateDrawWrapper = () => {
      // Refs
      const { id } = this;
      const svg = d3.select(`#${id}`);
      const { width, height } = this.state;

      // Update
      this.updateDraw(svg, width, height);
  };

  /** @abstract */
  firstDraw = (svg, width, height) => throw new Error(
      'D3Component.firstDraw() is an abstract method. Implement it somewhere.',
  );

  /** @abstract */
  updateDraw = (svg, width, height) => throw new Error(
      'D3Component.updateDraw() is an abstract method. Implement it somewhere.',
  );

  render = () => {
      const { id, myRef } = this;
      const { style } = this.props;
      return (
          <svg id={id} style={{ overflow: 'visible', ...style }} ref={myRef} />
      );
  };
}
