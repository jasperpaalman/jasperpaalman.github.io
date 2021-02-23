import React from 'react';
import { Image } from 'semantic-ui-react';
import { SectionHeader, SubSectionHeader } from '../elements/text';
import EredivisieHistory from '../subsections/EredivisieHistory';
import ClubAnalysis from '../subsections/ClubAnalysis';

const Portfolio = () => (
    <div id="portfolio">
        <SectionHeader>Portfolio</SectionHeader>

        <SubSectionHeader>Eredivisie Visualization</SubSectionHeader>
        <Image
            src="/static/image/headers/eredivisie_banner.svg"
            style={{ width: '100%', marginBottom: '-1px' }}
        />
        <ClubAnalysis />
        <EredivisieHistory />
    </div>
);

export default Portfolio;
