import React from 'react';
import ReactPlayer from 'react-player';
import { Container } from 'semantic-ui-react';
import { SubSectionHeader, SectionText, Stress } from '../../elements/text';

const Webscraper = () => (
    <div id="webscraper">
        <SubSectionHeader>Webscraper</SubSectionHeader>
        <Container style={{ width: '40%' }}>
            <SectionText>
                <p>
                    In my work as a Data Scientist there have been many times when a
                    {' '}
                    <Stress>webscraping component</Stress>
                    {' '}
                    was necessary. The use of
                    open-source data can be beneficial to the
                    <Stress> performance</Stress>
                    {' '}
                    of a machine learning model or it can
                    simply offer information as is.
                    <br />
                    <br />
                    With that said, it can be difficult to scale your webscraper when
                    performing bulk searches. Maybe it is of interest to your business to
                    {' '}
                    <Stress>recursively</Stress>
                    {' '}
                    search a website to collect it's
                    contents. Recursively searching such a website would then ideally be
                    executed
                    <Stress> in parallel</Stress>
                    .
                    <br />
                    <br />
                    Based on these challenges I have created a webscraper that can collect
                    the contents of multiple websites
                    {' '}
                    <Stress>simultaneously</Stress>
                    . In addition, a feature is added that can recursively collect data by
                    following urls on the same domain, when given a starting url as input.
                    This module is flexible and can be integrated in various applications.
                    <br />
                    <br />
                    The example below shows a recursive search with depth 1 on a Wikipedia
                    article. This means that based on the starting URL (depth 0), all URLs
                    with the Wikipedia domain are retrieved that exist on that URL. In
                    this case that totals 113 URLs. You can see that on a webpage such as
                    Wikipedia it would be rather ambitious to try anything over depth 1,
                    since every page can potentially have hundreds of links.
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
            url="https://youtu.be/j4OioiGzs3Q"
        />
    </div>
);

export default Webscraper;
