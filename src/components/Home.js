import React from 'react';
import { Image } from 'semantic-ui-react';
import TWATCM from './TWATCM';
import EredivisieHistory from './EredivisieHistory';
import ClubAnalysis from './ClubAnalysis';

const Home = () => (
    <div>
        <Image
            src="/static/image/banner.svg"
            style={{ width: '100%', marginBottom: '-1px' }}
        />
        {/* <TWATCM /> */}
        <ClubAnalysis />
        <EredivisieHistory />
    </div>
);

export default Home;
