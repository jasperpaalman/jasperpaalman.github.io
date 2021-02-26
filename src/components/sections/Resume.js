import * as d3 from 'd3';
import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { SectionHeader, SectionText, Stress } from '../elements/text';
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
                    <SectionText>
                        <p>
                            Here I have summarized my resume. It includes a selection of
                            Personal Information, Skills, Education, Work Experience and
                            Additional Activites. For convenience I have linked complementary
                            resources such as
                            {' '}
                            <Stress>Github</Stress>
                            {' '}
                            and
                            <Stress> LinkedIn</Stress>
                            .
                        </p>
                    </SectionText>
                    <div id="resume-svg">
                        <span dangerouslySetInnerHTML={{ __html: ResumeSVG }} />
                    </div>
                    <SectionText>
                        <p>
                            Additionarlly, as part of my
                            {' '}
                            <Stress>thesis</Stress>
                            {' '}
                            I have
                            performed research on the classification of very short texts with
                            the use of semantic information. It has been published in RANLP
                            2019 and can be found
                            {' '}
                            <a href="https://www.aclweb.org/anthology/R19-1102.pdf">here</a>
                            .
                        </p>
                    </SectionText>
                </Container>
            </div>
        );
    }
}
