import React from 'react';
import { Container } from 'semantic-ui-react';

import { SectionHeader, SectionText, Stress } from '../elements/text';

import './Projects.scss';

import Eredivisie from '../subsections/Eredivisie/main';
import Corona from '../subsections/Corona/main';
import Webscraper from '../subsections/Webscraper/main';
import PageMonitor from '../subsections/PageMonitor/main';

const Projects = () => (
    <div id="projects">
        <SectionHeader>Projects</SectionHeader>

        <Container>
            <SectionText>
                <p>
                    This section explores some of the projects that I have worked on. This
                    includes some interesting
                    {' '}
                    <Stress>interactive</Stress>
                    {' '}
                    data
                    visualizations. Best viewed in the browser!
                    {' '}
                </p>
            </SectionText>
        </Container>

        <Eredivisie />
        <Corona />
        <Webscraper />
        <PageMonitor />
    </div>
);

export default Projects;
