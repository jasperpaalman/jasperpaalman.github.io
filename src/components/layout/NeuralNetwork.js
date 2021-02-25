import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Visibility } from 'semantic-ui-react';
import NeuralNetworkPlot from '../d3/NeuralNetworkPlot';

export default class NeuralNetwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            networkActive: false,
        };
    }

  activateNetwork = () => {
      this.setState({ networkActive: true });
  };

  render() {
      const { networkActive } = this.state;

      return (
          <div id="neuralnetwork">
              <Visibility onBottomVisible={this.activateNetwork} />
              <NeuralNetworkPlot
                  radius={30}
                  layerNodes={[4, 3, 8, 5, 2]}
                  animationDuration={1000}
                  style={{ height: '50vh', width: '100%', margin: '16pt 0' }}
                  active={networkActive}
              />
          </div>
      );
  }
}
