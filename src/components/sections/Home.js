import * as d3 from 'd3';
import React, { Component } from 'react';
import BannerSVG from '../../assets/image/home_banner.svg';
import './Home.scss';

export default class Home extends Component {
    componentDidMount() {
        d3.select('#banner #Button')
            .attr('class', 'generic-button')
            .on('click', (event) => {
                document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
            });
    }

    render() {
        return (
            <div id="home">
                <div id="banner">
                    <span dangerouslySetInnerHTML={{ __html: BannerSVG }} />
                </div>
            </div>
        );
    }
}
