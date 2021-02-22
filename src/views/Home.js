import React from 'react';
import About from '../components/sections/About';
import Eredivisie from '../components/sections/Eredivisie';

const Home = () => (
    <div
        style={{
            'margin-top': '32pt',
            'margin-right': '10pt',
            'margin-left': '10pt',
        }}
    >
        <About />
        <Eredivisie />
    </div>
);

export default Home;
