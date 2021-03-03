import React, { Component } from 'react';
import { Visibility } from 'semantic-ui-react';
import NeuralNetworkAnimation from '../d3/NeuralNetworkAnimation';
import BasicBlock from '../elements/block';

export default class NeuralNetwork extends Component {
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
          <div id="neuralNetworkAnimation">
              <Visibility onBottomVisible={this.activateAnimation}>
                  <BasicBlock />
                  <NeuralNetworkAnimation
                      animationDuration={750}
                      style={{ height: '30vh', width: '100%' }}
                      active={animationActive}
                  />
                  <BasicBlock />
              </Visibility>
          </div>
      );
  }
}
