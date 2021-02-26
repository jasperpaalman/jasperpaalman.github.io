import React from 'react';
import ReactPlayer from 'react-player';
import { Container } from 'semantic-ui-react';
import { SubSectionHeader, SectionText, Stress } from '../../elements/text';

const PageMonitor = () => (
    <div id="pagemonitor">
        <SubSectionHeader>Page Monitor</SubSectionHeader>
        <Container style={{ width: '40%' }}>
            <SectionText>
                <p>
                    Building on the webscraper from before I encountered the need to
                    periodically monitor if a webpage was changed or not. Whereas there
                    are a few options available to schedule this, I saw it as an
                    interesting experiment to implement such a scheduler using the
                    {' '}
                    <Stress>Django</Stress>
                    {' '}
                    framework.
                    <br />
                    <br />
                    Under the hood,
                    {' '}
                    <Stress>Selenium</Stress>
                    {' '}
                    is used to retrieve a
                    screenshot of an url. Subsequently two consecutive screenshots are
                    compared. When differences pass a set threshold, the changes are
                    returned. With this application as a base, adding features such as
                    scheduling and selecting regions of interest on a page becomes
                    possible.
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
            url="https://youtu.be/rIQXvGRobec"
        />
    </div>
);

export default PageMonitor;
