import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Page from './components/views/Page';

const App = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Page} />
        </Switch>
    </Router>
);

export default App;
