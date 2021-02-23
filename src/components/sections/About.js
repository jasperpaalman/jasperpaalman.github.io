import React, { Component } from 'react';
import { Image, Container } from 'semantic-ui-react';
import { TextBlock, SectionHeader } from '../elements/text';

const About = () => (
    <div id="about">
        <SectionHeader>About</SectionHeader>
        <Container>
            <TextBlock>
                <p>
                    During the final stages of my academic studies I've come into contact
                    with Data Science and Software Engineering. I've come to understand
                    that my interest lies in the development of end-to-end products, with
                    potientally a data influence. Projects that I've completed over time
                    highlight for me that various domains can benefit from data products
                    and digitalization. Currently I'm working on extending my software
                    engineering skills in order to realize lasting products.
                    {' '}
                </p>
            </TextBlock>
        </Container>
    </div>
);

export default About;
