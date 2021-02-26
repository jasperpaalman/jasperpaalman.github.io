import React from 'react';
import { Container } from 'semantic-ui-react';
import { SectionText, SectionHeader, Stress } from '../elements/text';

const About = () => (
    <div id="about">
        <SectionHeader>About</SectionHeader>
        <Container>
            <SectionText>
                <p>
                    During the final stages of my academic studies I've come into contact
                    with
                    {' '}
                    <Stress>Data Science</Stress>
                    {' '}
                    and
                    {' '}
                    <Stress>Software Engineering</Stress>
                    . I've come to understand that my
                    interest lies in the development of
                    {' '}
                    <Stress>end-to-end products</Stress>
                    , with potientally a data influence.
                    <br />
                    <br />
                    Projects that I've completed over time highlight for me that various
                    domains can benefit from data products and digitalization. Currently
                    I'm working on extending my software engineering skills in order to
                    realize lasting products. Main areas of interest currently lie in
                    {' '}
                    <Stress>web-application development</Stress>
                    {' '}
                    and working in the
                    {' '}
                    <Stress>cloud</Stress>
                    .
                    <br />
                    <br />
                    Check out my resume and some of the projects that I have worked on
                    below 😊.
                </p>
            </SectionText>
        </Container>
    </div>
);

export default About;
