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
                    When the second corona wave was about to hit, I made a visual
                    representation of the daily number of
                    {' '}
                    <Stress>positive tests</Stress>
                    {' '}
                    in the Netherlands. It was a project I initiated to experiment with
                    open-source data in the context of a visualization type. It showcases
                    the relative number of positive tests over time. It highlighted for me
                    that the restrictions would have to be re-introduced in order to stop
                    exponential growth. In any case it proved to be an interesting story
                    telling technique.
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
            style={{ margin: 'auto' }}
            controls
            config={{
                youtube: {
                    playerVars: { fs: 0 },
                },
            }}
            width="1200px"
            height="675px"
            url="https://youtu.be/T8T-TXT1DKE"
        />
    </div>
);

export default Corona;
