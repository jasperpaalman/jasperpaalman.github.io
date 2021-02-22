import React from 'react';
import { Image } from 'semantic-ui-react';
import EredivisieHistory from '../components/EredivisieHistory';
import ClubAnalysis from '../components/ClubAnalysis';

const Home = () => (
    <div>
        <Image
            src="/static/image/banner.svg"
            style={{ width: '100%', marginBottom: '-1px' }}
        />
        <ClubAnalysis />
        <EredivisieHistory />
    </div>
);

export default Home;
