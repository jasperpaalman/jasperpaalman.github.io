import React from 'react';

import {
    Container,
    Image,
    Menu,
    Dropdown,
    Icon,
    Button,
} from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import Responsive from 'react-responsive';
import { getShadow } from '../../theme';

import CollisionChart from '../d3/CollisionChart';

import scrollToElement from '../../utils/scrollToElement';

const Desktop = (props) => <Responsive {...props} minWidth="50rem" />;
const Mobile = (props) => <Responsive {...props} maxWidth="50rem" />;

const items = [
    {
        key: 'about',
        name: 'about',
        text: 'About',
    },
    {
        key: 'resume',
        name: 'resume',
        text: 'Resume',
    },
    {
        key: 'projects',
        name: 'projects',
        text: 'Projects',
        subitems: [
            { key: 'eredivisie', name: 'eredivisie', text: 'Eredivisie' },
            { key: 'corona', name: 'corona', text: 'Corona' },
            { key: 'webscraper', name: 'webscraper', text: 'Webscraper' },
            { key: 'pagemonitor', name: 'pagemonitor', text: 'Page Monitor' },
        ],
    },
];

const getIsSafari = () => {
    // eslint-disable-next-line no-undef
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') !== 1 && ua.indexOf('chrome') < 0;
};

// eslint-disable-next-line no-undef
const isSafari = getIsSafari();
const homeAnchor = '/#home';

const TopMenu = ({ fixed }) => {
    const transitionStyle = '.6s ease';
    const height = 4; // vh
    // const margin = '4pt';
    const padding = '8pt';

    const menuItemStyle = {
        lineHeight: `${height}vh`,
        padding,
        margin: '0',
        fontSize: '12pt',
        color: 'inherit',
        transition: `color ${transitionStyle}`,
        fontWeight: '300',
        fontFamily: "'roboto', sans-serif",
    };

    const style = {
        fixed: 'top',
        style: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            color: 'rgb(255,255,255)',
            borderBottom: 'none',
            transition: `background-color ${transitionStyle}`,
            overflow: 'visible',
        },
        logoStyle: {
            margin: padding,
            height: `${height * 2}vh`,
            transition: `height ${transitionStyle}`,
        },
        dropDownItemStyle: {
            backgroundColor: 'transparent',
            height: `${height}vh`,
            padding: '0pt',
            margin: '0',
            fontSize: '12pt',
            color: 'rgb(255,255,255)',
            transition: `color ${transitionStyle}`,
            fontWeight: '300',
            fontFamily: "'roboto', sans-serif",
        },
    };

    if (fixed) {
        style.style = Object.assign(style.style, {
            backgroundColor: 'rgba(255,255,255,1)',
            boxShadow: getShadow(3, true),
            color: 'rgb(0, 0, 0)',
        });
        style.dropDownItemStyle = Object.assign(style.dropDownItemStyle, {
            color: 'rgb(0, 0, 0)',
        });
        style.logoStyle = Object.assign(style.logoStyle, {
            height: `${height}vh`,
        });
    }

    return (
        <Menu pointing secondary fixed={style.fixed} style={style.style}>
            {/* <CollisionChart
                style={{
                    position: 'fixed',
                    width: '100vw',
                    height: '7vh',
                }}
            /> */}
            <Container>
                <Menu.Menu>
                    <Image
                        alt="Logo Dark"
                        src="/static/image/layout/logo_dark.png"
                        style={style.logoStyle}
                        onClick={() => {
                            scrollToElement(document.querySelector('#home'));
                        }}
                    />
                </Menu.Menu>
                {isSafari ? null : (
                    <Menu.Menu position="right" style={{ height: 'fit-content' }}>
                        <Desktop>
                            {items.map((item) => {
                                if ('subitems' in item) {
                                    return (
                                        <Menu.Item key={item.name} style={menuItemStyle}>
                                            <Button.Group>
                                                <Button
                                                    key={item.name}
                                                    name={item.name}
                                                    onClick={() => {
                                                        scrollToElement(
                                                            document.querySelector(`#${item.name}`),
                                                        );
                                                    }}
                                                    style={style.dropDownItemStyle}
                                                >
                                                    {item.text}
                                                </Button>
                                                <Dropdown floating style={style.dropDownItemStyle}>
                                                    <Dropdown.Menu>
                                                        {item.subitems.map((subitem) => (
                                                            <Dropdown.Item
                                                                key={subitem.name}
                                                                name={subitem.name}
                                                                text={subitem.text}
                                                                onClick={() => {
                                                                    scrollToElement(
                                                                        document.querySelector(`#${subitem.name}`),
                                                                    );
                                                                }}
                                                            />
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Button.Group>
                                        </Menu.Item>
                                    );
                                }
                                return (
                                    <Menu.Item
                                        key={item.name}
                                        name={item.name}
                                        style={menuItemStyle}
                                        onClick={() => {
                                            scrollToElement(document.querySelector(`#${item.name}`));
                                        }}
                                    >
                                        {item.text}
                                    </Menu.Item>
                                );
                            })}
                        </Desktop>
                        <Mobile>
                            <Menu.Item style={menuItemStyle}>
                                <Dropdown
                                    floating
                                    trigger={<Icon name="sidebar" />}
                                    className={`menu-dropdown ${fixed ? ' fixed' : ' '}`}
                                    style={style.dropDownItemStyle}
                                >
                                    <Dropdown.Menu>
                                        {items.map((item) => (
                                            <Dropdown.Item
                                                key={item.name}
                                                name={item.name}
                                                text={item.text}
                                                onClick={() => {
                                                    scrollToElement(
                                                        document.querySelector(`#${item.name}`),
                                                    );
                                                }}
                                            />
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Item>
                        </Mobile>
                    </Menu.Menu>
                )}
            </Container>
        </Menu>
    );
};

TopMenu.propTypes = {
    fixed: PropTypes.bool.isRequired,
};

export default TopMenu;
