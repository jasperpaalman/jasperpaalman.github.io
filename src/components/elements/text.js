import React from 'react';
import * as PropTypes from 'prop-types';
import { Header, Divider } from 'semantic-ui-react';

const TextBlock = ({ children, style }) => (
    <div
        style={{
            fontSize: '14pt',
            margin: '32pt 10pt',
            textAlign: 'justify',
            lineHeight: '2em',
            border: '1px solid rgba(0,0,0,.2)',
            borderRadius: '16pt',
            padding: '16pt',
            ...(style || {}),
        }}
    >
        {children}
    </div>
);

const SectionText = ({ children, style }) => (
    <div
        style={{
            fontSize: '14pt',
            marginBottom: '16pt',
            textAlign: 'justify',
            lineHeight: '2em',
            borderTop: '2px solid #271d66',
            borderBottom: '2px solid #271d66',
            padding: '16pt',
            ...(style || {}),
        }}
    >
        {children}
    </div>
);

const CustomHeader = ({ children }) => (
    <Header
        content={children}
        style={{
            textAlign: 'center',
            color: '#271d66',
            fontSize: '24pt',
        }}
    />
);

const Stress = ({ children }) => (
    <span style={{ color: '#51D5FF' }}>{children}</span>
);

const Marked = ({ children }) => (
    <span style={{ fontWeight: 'bold', color: '#e61d49' }}>{children}</span>
);

const SectionHeader = ({ children }) => (
    <div>
        <hr
            style={{
                backgroundColor: '#345A66',
                height: '5pt',
            }}
        />
        <Header
            content={children}
            style={{
                textAlign: 'center',
                paddingTop: '16pt',
                paddingBottom: '16pt',
                color: '#345A66',
                fontSize: '30pt',
            }}
        />
    </div>
);

const SubSectionHeader = ({ children }) => (
    <div>
        <Header
            content={children}
            style={{
                textAlign: 'center',
                paddingTop: '10pt',
                paddingBottom: '10pt',
                color: '#345A66',
                fontSize: '20pt',
            }}
        />
    </div>
);

Marked.prototype.propTypes = {
    children: PropTypes.any.isRequired,
};

Stress.prototype.propTypes = {
    children: PropTypes.any.isRequired,
};

CustomHeader.prototype.propTypes = {
    children: PropTypes.any.isRequired,
};

TextBlock.prototype.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any,
};

TextBlock.prototype.defaultProps = {
    style: null,
};

SectionText.prototype.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any,
};

SectionText.prototype.defaultProps = {
    style: null,
};

SectionHeader.prototype.propTypes = {
    children: PropTypes.any.isRequired,
};

SubSectionHeader.prototype.propTypes = {
    children: PropTypes.any.isRequired,
};

export {
    Marked,
    Stress,
    TextBlock,
    CustomHeader,
    SectionText,
    SectionHeader,
    SubSectionHeader,
};
