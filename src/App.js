import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import ScrollToTop from 'react-router-scroll-top';
import NavigationBar from './components/layout/NavigationBar';
import Home from './views/Home';

const App = () => (
    <div>
        <NavigationBar />
        <Router>
            <div>
                {/* A <Switch> looks through its children <Route>s and
    renders the first one that matches the current URL. */}
                <ScrollToTop>
                    <Switch>
                        <Route
                            // exact
                            path="/"
                            component={Home}
                        />
                    </Switch>
                </ScrollToTop>
            </div>
        </Router>
    </div>
);

export default App;
