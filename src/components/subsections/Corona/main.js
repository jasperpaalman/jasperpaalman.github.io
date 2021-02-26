import React from 'react';
import ReactPlayer from 'react-player';
import { Container } from 'semantic-ui-react';
import { SubSectionHeader, SectionText, Stress } from '../../elements/text';

const Corona = () => (
    <div id="corona">
        <SubSectionHeader>Corona Situational Visualization</SubSectionHeader>
        <Container style={{ width: '40%' }}>
            <SectionText>
                <p>
                    When the second corona wave was building up, I made a visual
                    representation of the daily number of
                    {' '}
                    <Stress>positive tests</Stress>
                    {' '}
                    in the Netherlands. It was a project I initiated to experiment with
                    open-source data and a distinctive visualization type. It showcases
                    the relative number of positive tests over time. It proved to be an
                    impactful way of representing data, with new posibilities of detecting
                    trends over time.
                    <br />
                    <br />
                    <Stress>Note:</Stress>
                    {' '}
                    The number of tests has increased over time, so
                    the presented representation is biased.
                </p>
            </SectionText>
        </Container>
        <ReactPlayer
            className="video-container"
            width="100%"
            height="100%"
            controls
            // config={{
            //     youtube: {
            //         playerVars: { fs: 0 },
            //     },
            // }}
            url="https://youtu.be/T8T-TXT1DKE"
        />
    </div>
);

export default Corona;
