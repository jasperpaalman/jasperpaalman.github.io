import React, { PureComponent } from 'react';
import { Button, Grid, Icon } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import Slider from './Slider';

export default class Home extends PureComponent {
  static propTypes = {
      minYear: PropTypes.number.isRequired,
      maxYear: PropTypes.number.isRequired,
      selectedYear: PropTypes.number.isRequired,
      setSelectedYear: PropTypes.func.isRequired,
      tickDuration: PropTypes.number.isRequired,
  };

  constructor(props) {
      super(props);
      this.state = {
          playing: false,
          stepSize: 1,
      };
      this.interval = null;
  }

  togglePlay = () => {
      const { playing } = this.state;
      const {
          tickDuration,
          selectedYear,
          minYear,
          maxYear,
          setSelectedYear,
      } = this.props;

      const newPlaying = !playing;

      if (newPlaying) {
      // eslint-disable-next-line
      this.interval = window.setInterval(this.handleTick, tickDuration);
          if (selectedYear >= maxYear) {
              setSelectedYear(minYear);
          }
      } else {
      // eslint-disable-next-line
      window.clearInterval(this.interval);
          this.interval = null;
      }
      this.setState({ playing: newPlaying });
  };

  handleTick = () => {
      const { selectedYear, setSelectedYear, maxYear } = this.props;
      const { stepSize } = this.state;
      const newYear = selectedYear + stepSize;

      if (newYear >= maxYear) {
          this.togglePlay();
      }
      setSelectedYear(newYear);
  };

  render = () => {
      const { playing, stepSize } = this.state;
      const label = playing ? 'Pause' : 'Play';
      const {
          minYear, maxYear, selectedYear, setSelectedYear,
      } = this.props;
      return (
          <Grid verticalAlign="middle">
              <Grid.Row>
                  <Grid.Column width={3} style={{ textAlign: 'center' }}>
                      <Button
                          toggle
                          active={playing}
                          onClick={this.togglePlay}
                          style={{ padding: '8pt', margin: 'auto' }}
                      >
                          <Icon name={label.toLowerCase()} />
                          <div style={{ width: '30pt', display: 'inline-block' }}>
                              {label}
                          </div>
                      </Button>
                  </Grid.Column>
                  <Grid.Column width={12}>
                      <Slider
                          minYear={minYear}
                          maxYear={maxYear}
                          selectedYear={selectedYear}
                          setSelectedYear={setSelectedYear}
                          stepSize={stepSize}
                          style={{ height: '100px', width: '100%' }}
                      />
                  </Grid.Column>
              </Grid.Row>
          </Grid>
      );
  };
}
