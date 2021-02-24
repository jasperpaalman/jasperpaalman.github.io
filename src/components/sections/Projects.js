import React from 'react';
import { SectionHeader, SectionText, Stress } from '../elements/text';
import Eredivisie from '../subsections/Eredivisie/main';

const Projects = () => (
    <div id="projects">
        <SectionHeader>Projects</SectionHeader>
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
        <Eredivisie />
    </div>
);

export default Projects;
