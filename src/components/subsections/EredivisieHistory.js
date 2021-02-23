import { Container, Image } from 'semantic-ui-react';
import React, { Component } from 'react';
import * as d3 from 'd3';
import TimeLine from '../d3/TimeLine';
import RankGrid from '../d3/RankGrid';
import TimeSelector from '../d3/TimeSelector';
import { CustomHeader, Marked, TextBlock } from '../elements/text';

export default class EredivisieHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            years: null,
            minYear: null,
            maxYear: null,
            selectedYear: null,
            tickDuration: 1000,
        };
        this.loadData();
    }

  loadData = () => {
      d3.json('/static/data/points_accumulated.json').then((data) => {
          const years = Object.keys(data).map((d) => +d);
          const minYear = d3.min(years);
          const maxYear = d3.max(years);
          this.setState({
              data,
              years,
              selectedYear: minYear,
              minYear,
              maxYear,
          });
      });
  };

  Text0 = () => (
      <TextBlock>
          <p>
              Now you something about was has happened in the most recent matches...
              But what about the
              <Marked>{' history '}</Marked>
              of the Eredivisie? Below you can find a graph that shows you the entire
              history of the Eredivisie with just a click of the button. The
              <Marked>{' y-axis '}</Marked>
              shows the highest number of
              <Marked>{' points a club has attained '}</Marked>
              in a season. This allows you to see the ranking of clubs within a
              season. The
              <Marked>{' x-axis '}</Marked>
              shows the
              <Marked>{' cumulative points of each club '}</Marked>
              which is the total score of a club across all seasons it has played so
              far.
          </p>
      </TextBlock>
  );

  Text1 = () => (
      <div>
          <CustomHeader>Ranking</CustomHeader>
          <TextBlock style={{ margin: '0pt 0pt 0pt 32pt' }}>
              <p>
                  Eredivisie History, check!... Or is something still missing? What
                  about the final ranking of all clubs in a single overview?! The graph
                  below shows the ranking of clubs in the Eredivisie throughout seasons.
                  Now, this might seem a little bit crowded but do not worry... Just
                  click on any logo and it will be much nicer.
              </p>
          </TextBlock>
      </div>
  );

  render() {
      const {
          data,
          years,
          tickDuration,
          selectedYear,
          minYear,
          maxYear,
      } = this.state;

      if (data && years && selectedYear) {
          return (
              <div>
                  <Image
                      src="/static/image/headers/eredivisie_history.svg"
                      style={{ width: '100%' }}
                  />
                  <Container>
                      <this.Text0 />
                  </Container>
                  <TimeSelector
                      minYear={minYear}
                      maxYear={maxYear}
                      selectedYear={selectedYear}
                      setSelectedYear={(newSelectedYear) => this.setState({ selectedYear: newSelectedYear })}
                      tickDuration={tickDuration}
                      style={{ height: '100pt', width: '100%' }}
                  />
                  <TimeLine
                      selectedYear={selectedYear}
                      tickDuration={tickDuration}
                      data={data}
                      years={years}
                      style={{ height: '400pt', width: '100%', margin: '32pt 0' }}
                  />
                  <Container>
                      <this.Text1 />
                      <div
                          style={{
                              width: 'fit-content',
                              margin: '10pt auto',
                          }}
                      >
                          <select id="rank-dropdown" />
                      </div>
                  </Container>
                  <RankGrid
                      data={data}
                      years={years}
                      style={{ height: '500pt', width: '100%', margin: '16pt 0' }}
                  />
              </div>
          );
      }
      return null;
  }
}
