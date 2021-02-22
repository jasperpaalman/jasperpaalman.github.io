import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-scroll';

export default class NavigationBar extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand>Jasper Paalman</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
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
                                to="eredivisie"
                                activeClass="active"
                                spy
                                smooth
                            >
                                Eredivisie
                            </Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
