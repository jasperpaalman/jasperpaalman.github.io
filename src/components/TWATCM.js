import {
    Container, Grid, Header, Image,
} from 'semantic-ui-react';

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import HeadToHead from './HeadToHead';
import { toIcon } from '../util';
import { Marked, TextBlock } from './text';

const hardCodedTWATCM = [
    {
        message: 'Unexpected',
        teamA: 'FC Emmen',
        teamB: 'FC Groningen',
        goalsA: 1,
        goalsB: 0,
    },
    {
        message: 'Largest Difference',
        teamA: 'ADO Den Haag',
        teamB: 'Willem II',
        goalsA: 6,
        goalsB: 2,
    },
    {
        message: 'Underdog',
        teamA: 'Excelsior',
        teamB: 'AZ',
        goalsA: 4,
        goalsB: 2,
    },
];

const lastWeek = [
    {
        teamA: 'VVV-Venlo',
        teamB: 'Vitesse',
        goalsA: 1,
        goalsB: 3,
    },
    {
        teamA: 'De Graafschap',
        teamB: 'Ajax',
        goalsA: 1,
        goalsB: 4,
    },
    {
        teamA: 'NAC Breda',
        teamB: 'PEC Zwolle',
        goalsA: 0,
        goalsB: 0,
    },
    {
        teamA: 'FC Emmen',
        teamB: 'FC Groningen',
        goalsA: 1,
        goalsB: 0,
    },
    {
        teamA: 'Fortuna Sittard',
        teamB: 'Feyenoord',
        goalsA: 1,
        goalsB: 4,
    },
    {
        teamA: 'FC Utrecht',
        teamB: 'SC Heerenveen',
        goalsA: 3,
        goalsB: 1,
    },
    {
        teamA: 'PSV',
        teamB: 'Heracles Almelo',
        goalsA: 3,
        goalsB: 1,
    },
    {
        teamA: 'ADO Den Haag',
        teamB: 'Willem II',
        goalsA: 6,
        goalsB: 2,
    },
    {
        teamA: 'Excelsior',
        teamB: 'AZ',
        goalsA: 4,
        goalsB: 2,
    },
];

const nextWeek = [
    // {
    //     teamA: 'VVV-Venlo',
    //     teamB: 'Vitesse',
    // },
    // {
    //     teamA: 'NAC Breda',
    //     teamB: 'PEC Zwolle',
    // },
    // {
    //     teamA: 'Fortuna Sittard',
    //     teamB: 'Feyenoord',
    // },
    // {
    //     teamA: 'PSV',
    //     teamB: 'Heracles Almelo',
    // },
    // {
    //     teamA: 'Excelsior',
    //     teamB: 'AZ',
    // },
    // {
    //     teamA: 'De Graafschap',
    //     teamB: 'Ajax',
    // },
    // {
    //     teamA: 'FC Emmen',
    //     teamB: 'FC Groningen',
    // },
    // {
    //     teamA: 'FC Utrecht',
    //     teamB: 'SC Heerenveen',
    // },
    // {
    //     teamA: 'ADO Den Haag',
    //     teamB: 'Willem II',
    // },
];

export default class TWATCM extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headToHead: null,
        };
    }

  setHeadToHead = (teamA, teamB) => this.setState({ headToHead: [teamA, teamB] });

  Text = () => (
      <TextBlock>
          <p>
              Do you want to know what is going to be discussed at the
              {' '}
              <Marked>coffee machine</Marked>
              ? We have the solution for you! Below you
              can find the last matches that were played and upcoming matches.
          </p>
          <p>
              Select two clubs to see how their matches have played out the last times
              they played. What you will see is a graph that shows the
              {' '}
              <Marked>difference in points between the two clubs</Marked>
              . If you do
              not see a graph for a certain match, then that match resulted in a draw
              and therefore the difference in points scores was 0.
          </p>
      </TextBlock>
  );

  render() {
      const { headToHead } = this.state;

      const blockStyle = {
          border: '1px solid rgba(0,0,0,.4)',
          borderRadius: '8pt',
          padding: '16pt 8pt',
          margin: '8pt 8pt 32pt 8pt',
      };

      return (
          <div>
              <Container>
                  <this.Text />
                  <Grid columns={3} style={{ margin: '32pt 0' }}>
                      <Grid.Row>
                          {hardCodedTWATCM.map(
                              ({
                                  message, teamA, teamB, goalsA, goalsB,
                              }) => (
                                  <Grid.Column
                                      key={`${teamA} - ${teamB}`}
                                      onClick={() => this.setHeadToHead(teamA, teamB)}
                                  >
                                      <Match
                                          message={message}
                                          teamA={teamA}
                                          teamB={teamB}
                                          goalsA={goalsA}
                                          goalsB={goalsB}
                                      />
                                  </Grid.Column>
                              ),
                          )}
                      </Grid.Row>
                  </Grid>
                  {headToHead ? <HeadToHead teams={headToHead} /> : null}
              </Container>
              <Grid columns={2} style={{ margin: '0 32pt' }}>
                  <Grid.Row>
                      <Grid.Column>
                          <div style={blockStyle}>
                              <Header
                                  content="Last Match Round"
                                  style={{ textAlign: 'center' }}
                              />
                              <MatchGrid matches={lastWeek} cellClick={this.setHeadToHead} />
                          </div>
                      </Grid.Column>
                      <Grid.Column>
                          <div style={blockStyle}>
                              <Header
                                  content="Next Match Round"
                                  style={{ textAlign: 'center' }}
                              />
                              {/* <MatchGrid matches={nextWeek} cellClick={this.setHeadToHead} /> */}
                              <p style={{ textAlign: 'center', fontSize: '14pt' }}>
                                  End of competition, no upcoming match rounds.
                              </p>
                          </div>
                      </Grid.Column>
                  </Grid.Row>
              </Grid>
          </div>
      );
  }
}

const MatchGrid = ({ matches, cellClick }) => {
    const height = Math.ceil(matches.length / 3);
    const width = Math.ceil(matches.length / height);

    // console.log({ height, width, matches });

    return (
        <Grid columns={3}>
            {[...Array(height).keys()].map((row) => (
                <Grid.Row key={row}>
                    {[...Array(width).keys()]
                        .filter((column) => row * 3 + column < matches.length)
                        .map((column) => {
                            const match = matches[row * 3 + column];
                            return (
                                <Grid.Column
                                    key={column}
                                    onClick={() => cellClick(match.teamA, match.teamB)}
                                >
                                    <Match {...match} />
                                </Grid.Column>
                            );
                        })}
                </Grid.Row>
            ))}
        </Grid>
    );
};

MatchGrid.prototype.propTypes = {
    matches: PropTypes.any.isRequired,
    cellClick: PropTypes.any.isRequired,
};

const Match = ({
    message, teamA, teamB, goalsA, goalsB, small,
}) => {
    const size = '40pt';
    return (
        <div style={{ textAlign: 'center', margin: '8pt', fontSize: '16pt' }}>
            {message ? <Header as="h3">{message}</Header> : null}
            <div style={{ lineHeight: size }}>
                <Image
                    style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        maxWidth: size,
                        maxHeight: size,
                    }}
                    src={toIcon(teamA)}
                />
                <span style={{ margin: '0 8pt' }}>
                    {goalsA !== null
          && goalsA !== undefined
          && goalsB !== null
          && goalsB !== undefined
                        ? `${goalsA} - ${goalsB}`
                        : 'VS'}
                </span>
                <Image
                    style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        maxWidth: size,
                        maxHeight: size,
                    }}
                    src={toIcon(teamB)}
                />
            </div>
        </div>
    );
};

Match.prototype.propTypes = {
    message: PropTypes.string,
    teamA: PropTypes.string.isRequired,
    teamB: PropTypes.string.isRequired,
    goalsA: PropTypes.string,
    goalsB: PropTypes.string,
    small: PropTypes.bool,
};

Match.prototype.defaultProps = {
    message: null,
    goalsA: null,
    goalsB: null,
    small: null,
};
