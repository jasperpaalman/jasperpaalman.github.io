import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import ScrollToTop from 'react-router-scroll-top';
import Home from './views/Home';

const App = () => (
    <Router>
        <ScrollToTop>
            <Switch>
                <Route
                    // exact
                    path="/"
                    component={Home}
                />
            </Switch>
        </ScrollToTop>
    </Router>
);

export default App;
