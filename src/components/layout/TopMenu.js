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
    const height = '32pt';
    const margin = '8pt';
    const menuItemStyle = {
        lineHeight: height,
        padding: '8pt',
        margin: '0',
        fontSize: '12pt',
        color: 'inherit',
        transition: `color ${transitionStyle}`,
        fontWeight: '300',
        fontFamily: "'roboto', sans-serif",
    };

    const style = {
        fixed: 'top',
        inverted: false,
        style: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            color: 'rgb(255,255,255)',
            borderBottom: 'none',
            transition: `background-color ${transitionStyle}`,
        },
        logoStyle: {
            margin,
            height: '64pt',
            transition: `height ${transitionStyle}`,
        },
        dropDownItemStyle: {
            backgroundColor: 'transparent',
            height,
            padding: '0',
            margin: '0',
            fontSize: '12pt',
            color: 'rgb(255,255,255)',
            transition: `color ${transitionStyle}`,
            fontWeight: '300',
            fontFamily: "'roboto', sans-serif",
        },
    };

    if (fixed) {
        style.inverted = false;
        style.style = Object.assign(style.style, {
            backgroundColor: 'rgba(255,255,255,1)',
            boxShadow: getShadow(3, true),
            color: 'rgb(0, 0, 0)',
        });
        style.dropDownItemStyle = Object.assign(style.dropDownItemStyle, {
            color: 'rgb(0, 0, 0)',
        });
        style.logoStyle = Object.assign(style.logoStyle, {
            height: '32pt',
        });
    }

    return (
        <Menu
            pointing
            secondary
            inverted={style.inverted}
            fixed={style.fixed}
            style={style.style}
        >
            <Container>
                <Menu.Menu>
                    <Image
                        alt="Logo Dark"
                        src="/static/image/menu/logo_dark.png"
                        style={style.logoStyle}
                        onClick={() => {
                            document
                                .querySelector('#home')
                                .scrollIntoView({ behavior: 'smooth' });
                        }}
                    />
                </Menu.Menu>
                {isSafari ? null : (
                    <Menu.Menu position="right" style={{ height: 'fit-content' }}>
                        <Desktop>
                            {items.map((item) => {
                                if ('subitems' in item) {
                                    return (
                                        <Menu.Item key={item.name}>
                                            <Button.Group>
                                                <Button
                                                    key={item.name}
                                                    name={item.name}
                                                    onClick={() => {
                                                        document
                                                            .querySelector(`#${item.name}`)
                                                            .scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    style={style.dropDownItemStyle}
                                                >
                                                    {item.text}
                                                </Button>
                                                <Dropdown
                                                    className="button icon"
                                                    floating
                                                    trigger={<></>}
                                                    style={Object.assign(style.dropDownItemStyle, {
                                                        padding: '4pt',
                                                    })}
                                                >
                                                    <Dropdown.Menu>
                                                        {item.subitems.map((subitem) => (
                                                            <Dropdown.Item
                                                                key={subitem.name}
                                                                name={subitem.name}
                                                                onClick={() => {
                                                                    document
                                                                        .querySelector(`#${subitem.name}`)
                                                                        .scrollIntoView({ behavior: 'smooth' });
                                                                }}
                                                            >
                                                                {subitem.text}
                                                            </Dropdown.Item>
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
                                            document
                                                .querySelector(`#${item.name}`)
                                                .scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        {item.text}
                                    </Menu.Item>
                                );
                            })}
                        </Desktop>
                        <Mobile>
                            <Menu.Item>
                                <Dropdown
                                    floating
                                    trigger={<Icon name="sidebar" />}
                                    className={`menu-dropdown ${fixed ? ' fixed' : ' '}`}
                                >
                                    <Dropdown.Menu>
                                        {items.map((item) => (
                                            <Dropdown.Item
                                                key={item.name}
                                                as="a"
                                                text={item.text}
                                                href={item.href}
                                                style={{
                                                    lineHeight: '1rem !important',
                                                    fontSize: '1rem !important',
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
