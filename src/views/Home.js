import React from 'react';
import About from '../components/sections/About';
import Eredivisie from '../components/sections/Eredivisie';

const Home = () => (
    <div
        style={{
            marginTop: '32pt',
            marginRight: '5pt',
            marginLeft: '5pt',
        }}
    >
        <About />
        <Eredivisie />
    </div>
);

export default Home;
