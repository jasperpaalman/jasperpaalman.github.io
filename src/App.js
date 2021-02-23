import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Page from './views/Page';
import ScrollToTopOnMount from './utils/ScrollToTop';

const App = () => (
    <Router>
        <ScrollToTopOnMount />
        <Switch>
            <Route
                // exact
                path="/"
                component={Page}
            />
        </Switch>
    </Router>
);

export default App;
