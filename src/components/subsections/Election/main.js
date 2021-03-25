import React from 'react';
import { Container } from 'semantic-ui-react';
import { SubSectionHeader, SectionText, Stress } from '../../elements/text';
import ElectionPlot from '../../d3/ElectionPlot';

const Election = () => (
    <div id="election">
        <SubSectionHeader>Election Results</SubSectionHeader>
        <Container style={{ width: '40%' }}>
            <SectionText>
                <p>
                    The 2021 election for the House of Representatives in the Netherlands
                    has been rather unusual. Parties on the left generally lost and
                    multiple tiny parties have emerged to claim one or more seats.
                    Furthermore, the latest coalition, which resigned not so long ago
                    could potentially be reinstated in the exact same formation.
                    <br />
                    <br />
                    I've aimed to visualize the (provisional)
                    <Stress> election results </Stress>
                    {' '}
                    with pleasant transitions and
                    persistent elements.
                    <br />
                    <br />
                    Three different visualizations are available: Overview, Force and
                    Difference. The
                    <Stress> Overview </Stress>
                    tab shows the general results, with differences. The
                    <Stress> Force </Stress>
                    tab presents an interactive visualization where you can play around
                    with different coalitions. Hover your cursor over a node and it will
                    indicate what party is refered to. Lastly, the
                    <Stress> Difference </Stress>
                    tab shows a basic visualization concentrated on higlighting relative
                    increase or decline.
                </p>
            </SectionText>
        </Container>
        <ElectionPlot style={{ height: '50vh', width: '100%', margin: '32pt 0' }} />
    </div>
);

export default Election;
