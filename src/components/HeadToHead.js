import React, { Component } from 'react';
import * as d3 from 'd3';
import {
    Container, Grid, Header, Image,
} from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import HeadToHeadPlot from './d3/HeadToHeadPlot';
import { toIcon } from '../util';

export default class HeadToHead extends Component {
  static propTypes = {
      teams: PropTypes.any.isRequired,
  };

  constructor(props) {
      super(props);
      this.state = { data: null };
      this.loadData();
  }

  getMatches = (teamA, teamB) => {
      const { data } = this.state;
      return this.chain(
          Object.entries(data).map(([year, yearMatches]) => yearMatches?.[teamA]
              ?.filter((match) => match.Against === teamB)
              ?.map((match) => {
                  const away = match.Location === 'Away';
                  const scoreSegment = match.Score.split('-');
                  return {
                      year: `${year - 1} - ${year}`,
                      away,
                      scoreTeamA: away ? scoreSegment[1] : scoreSegment[0],
                      scoreTeamB: away ? scoreSegment[0] : scoreSegment[1],
                  };
              })),
      );
  };

  chain = (listOfLists) => Array.prototype.concat.apply([], listOfLists).filter((x) => x);

  loadData = () => {
      d3.json('/static/season_point_accumulation.json').then((data) => {
          this.setState({ data });
      });
  };

  render() {
      const { data } = this.state;
      const { teams } = this.props;
      const [teamA, teamB] = teams;
      const matches = data ? this.getMatches(teamA, teamB) : null;
      // console.log({ teams, matches });

      const iconStyle = {
          maxWidth: '50pt',
          maxHeight: '50pt',
          objectFit: 'contain',
          display: 'inline-block',
      };

      return (
          <Container>
              <Header
                  style={{
                      textAlign: 'center',
                      margin: '0 auto -50pt auto',
                      position: 'relative',
                      zIndex: '200',
                      width: 'fit-content',
                      background: 'rgba(255,255,255,.3)',
                  }}
              >
                  {`${teamA} vs ${teamB} (Match history)`}
              </Header>
              {matches ? (
                  <Grid verticalAlign="middle">
                      <Grid.Row>
                          <Grid.Column
                              style={{ width: 'calc(100% - 100pt)', padding: 0, margin: 0 }}
                          >
                              <HeadToHeadPlot
                                  style={{ height: '300pt', width: '100%' }}
                                  matches={matches}
                                  teams={teams}
                              />
                          </Grid.Column>
                          <Grid.Column
                              style={{
                                  textAlign: 'center',
                                  fontSize: '14pt',
                                  fontWeight: 'bold',
                                  lineHeight: '2em',
                                  width: '100pt',
                                  padding: 0,
                                  margin: 0,
                              }}
                          >
                              <p>
                                  {teamA}
                                  <br />
                                  <Image src={toIcon(teamA)} style={iconStyle} />
                              </p>
                              <div style={{ margin: '8pt 0' }}>VS</div>
                              <p>
                                  <Image src={toIcon(teamB)} style={iconStyle} />
                                  <br />
                                  {teamB}
                              </p>
                          </Grid.Column>
                      </Grid.Row>
                  </Grid>
              ) : (
                  'Loading'
              )}
          </Container>
      );
  }
}
