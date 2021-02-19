import React from 'react';
import * as PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';

const TextBlock = ({ children, style }) => (
    <div style={({

        fontSize: '14pt',
        margin: '32pt 0',
        textAlign: 'justify',
        lineHeight: '2em',
        border: '1px solid rgba(0,0,0,.2)',
        borderRadius: '16pt',
        padding: '16pt',
        ...style || {},
    })}
    >
        {children}
    </div>
);

const CustomHeader = ({ children }) => (
    <Header
        content={children}
        style={{
            textAlign: 'center', paddingTop: '32pt', color: '#271d66', fontSize: '24pt',
        }}
    />
);

const Marked = ({ children }) => (
    <span style={{ fontWeight: 'bold', color: '#e61d49' }}>
        {children}
    </span>
);

Marked.prototype.propTypes = {
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

export { Marked, TextBlock, CustomHeader };
