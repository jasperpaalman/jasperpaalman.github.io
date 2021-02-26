import React, { Component } from 'react';
import { Visibility } from 'semantic-ui-react';
import LineAnimation from '../d3/LineAnimation';
import BasicBlock from '../elements/block';

export default class Line extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animationActive: false,
        };
    }

  activateAnimation = () => {
      this.setState({ animationActive: true });
  };

  render() {
      const { animationActive } = this.state;

      return (
          <div id="lineAnimation">
              <Visibility onBottomVisible={this.activateAnimation}>
                  <BasicBlock />
                  <LineAnimation
                      style={{ height: '30vh', width: '100%' }}
                      active={animationActive}
                  />
                  <BasicBlock />
              </Visibility>
          </div>
      );
  }
}
