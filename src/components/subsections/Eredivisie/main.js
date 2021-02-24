import React from 'react';
import { Image } from 'semantic-ui-react';
import { SubSectionHeader } from '../../elements/text';
import EredivisieHistory from './EredivisieHistory';
import ClubAnalysis from './ClubAnalysis';

const Eredivisie = () => (
    <div id="eredivisie">
        <SubSectionHeader>Eredivisie Visualization</SubSectionHeader>
        <Image
            src="/static/image/subsections/eredivisie_banner.svg"
            style={{ width: '100%', marginBottom: '-1px' }}
        />
        <ClubAnalysis />
        <EredivisieHistory />
    </div>
);

export default Eredivisie;
