import React from 'react';
import { Image, Container } from 'semantic-ui-react';
import { SubSectionHeader, SectionText, Stress } from '../../elements/text';
import EredivisieHistory from './EredivisieHistory';
import ClubAnalysis from './ClubAnalysis';

const Eredivisie = () => (
    <div id="eredivisie">
        <SubSectionHeader>Eredivisie Visualization</SubSectionHeader>
        <Container style={{ width: '40%' }}>
            <SectionText>
                <p>
                    Me and a few fellow students were tasked to visualize the Dutch soccer
                    competition. Given that
                    {' '}
                    <Stress>D3.js</Stress>
                    {' '}
                    offers basically an
                    unbounded level of flexibility it was opted for to serve as the base.
                    After laborous work the result was unique, highly interactive
                    visualizations. It is connected to a webscraper, so with every reload
                    new information becomes available!
                </p>
            </SectionText>
        </Container>
        <Image
            src="/static/image/subsections/eredivisie_banner.svg"
            style={{ width: '100%', marginBottom: '-1px' }}
        />
        <ClubAnalysis />
        <EredivisieHistory />
    </div>
);

export default Eredivisie;
