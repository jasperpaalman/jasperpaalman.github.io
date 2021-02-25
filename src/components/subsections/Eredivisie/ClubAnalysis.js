import { Container, Image } from 'semantic-ui-react';
import * as d3 from 'd3';
import React, { Component } from 'react';
import ParallelCoordPlot from '../../d3/ParallelCoordPlot';
import { Marked, TextBlock } from '../../elements/text';

export default class ClubAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            years: null,
            defaultYear: null,
        };
        this.loadData();
    }

  Text = () => (
      <TextBlock>
          We created a graph that allows you to see everything you need to know in a
          season! You can see the relative points of each club in a season. Each
          vertical demonstrates a set of weekly matches. When you
          {' '}
          <Marked>click a club icon</Marked>
          {' '}
          you see details about each game the
          club has played during the Eredivisie. The color shows the outcome (
          <span style={{ color: 'rgb(213, 81, 80)', fontWeight: 'bold' }}>
              loss
          </span>
          {', '}
          <span style={{ color: 'rgb(65, 108, 175)', fontWeight: 'bold' }}>
              win
          </span>
          {', '}
          <span style={{ color: 'rgb(218, 176, 66)', fontWeight: 'bold' }}>
              draw
          </span>
          ), the vertical lines show the difference in points, and above each match
          you can see the changes in ranking (when a club is clicked on). Use the
          navigation buttons to alternate between different seasons to even view a
          club's performance over the years! You can also
          {' '}
          <Marked>hover</Marked>
          {' '}
          over a club or a line to have a quick overview of the performance of a
          club over time during a competition.
      </TextBlock>
  );

  loadData = () => {
      d3.json('/static/data/season_point_accumulation.json').then((data) => {
          const years = Object.keys(data).map((t) => +t);
          const defaultYear = d3.max(years);

          this.setState({
              data,
              years,
              defaultYear,
          });
      });
  };

  render() {
      const { data, years, defaultYear } = this.state;
      if (data && years) {
          return (
              <div>
                  <Image
                      src="/static/image/subsections/eredivisie_club_analysis.svg"
                      style={{ width: '100%' }}
                  />
                  <Container>
                      <this.Text />
                  </Container>
                  <ParallelCoordPlot
                      data={data}
                      years={years}
                      defaultYear={defaultYear}
                      style={{ height: '100vh', width: '100%', margin: '32pt 0' }}
                  />
              </div>
          );
      }
      return null;
  }
}
