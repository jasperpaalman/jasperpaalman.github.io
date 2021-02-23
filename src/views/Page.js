import React from 'react';
import NavigationBar from '../components/layout/NavigationBar';
import Home from '../components/sections/Home';
import About from '../components/sections/About';
import Resume from '../components/sections/Resume';
import Portfolio from '../components/sections/Portfolio';

const Page = () => (
    <div>
        <Home />
        <NavigationBar />
        <About />
        <Resume />
        <Portfolio />
    </div>
);

export default Page;
