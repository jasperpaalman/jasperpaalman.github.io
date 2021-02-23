import * as d3 from 'd3';
import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { SectionHeader } from '../elements/text';
import ResumeSVG from '../../assets/image/resume.svg';
import './Resume.scss';

export default class Resume extends Component {
    componentDidMount() {
        d3.select('#resume-svg #Github')
            .attr('class', 'generic-button')
            .on('click', (event) => {
                window.location = 'https://github.com/jasperpaalman';
            });

        d3.select('#resume-svg #LinkedIn')
            .attr('class', 'generic-button')
            .on('click', (event) => {
                window.location = 'https://www.linkedin.com/in/jasperpaalman/';
            });
    }

    render() {
        return (
            <div id="resume">
                <SectionHeader>Resume</SectionHeader>
                <Container>
                    <div id="resume-svg">
                        <span dangerouslySetInnerHTML={{ __html: ResumeSVG }} />
                    </div>
                </Container>
            </div>
        );
    }
}
