import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import { TextBlock } from '../text';

const About = () => (
    <div id="about">
        <Image
            src="/static/image/jasperpaalman.jpg"
            size="large"
            rounded
            centered
        />
        <TextBlock>
            <p>This field block can be used to give information on myself.</p>
        </TextBlock>
    </div>
);

export default About;
