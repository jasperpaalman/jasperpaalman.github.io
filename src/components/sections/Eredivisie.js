import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import EredivisieHistory from '../subsections/EredivisieHistory';
import ClubAnalysis from '../subsections/ClubAnalysis';

const Eredivisie = () => (
    <div id="eredivisie">
        <Image
            src="/static/image/headers/banner.svg"
            style={{ width: '100%', marginBottom: '-1px' }}
        />
        <ClubAnalysis />
        <EredivisieHistory />
    </div>
);

export default Eredivisie;
