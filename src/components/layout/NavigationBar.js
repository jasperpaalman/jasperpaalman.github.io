import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-scroll';

export default class NavigationBar extends Component {
    render() {
        return (
            <Navbar sticky="top" bg="dark" variant="dark" expand="xl">
                <Navbar.Brand>Jasper Paalman</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Item>
                            <Link
                                role="button"
                                onClick={this.handleScroll}
                                to="home"
                                activeClass="active"
                                spy
                                smooth
                            >
                                Home
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link
                                role="button"
                                onClick={this.handleScroll}
                                to="about"
                                activeClass="active"
                                spy
                                smooth
                            >
                                About
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link
                                role="button"
                                onClick={this.handleScroll}
                                to="resume"
                                activeClass="active"
                                spy
                                smooth
                            >
                                Resume
                            </Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Link
                                role="button"
                                onClick={this.handleScroll}
                                to="portfolio"
                                activeClass="active"
                                spy
                                smooth
                            >
                                Portfolio
                            </Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
