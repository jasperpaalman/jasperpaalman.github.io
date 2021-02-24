import React, { Component } from 'react';

import { Image } from 'semantic-ui-react';

import TopMenu from '../components/layout/TopMenu';
import Home from '../components/sections/Home';
import About from '../components/sections/About';
import Resume from '../components/sections/Resume';
import Projects from '../components/sections/Projects';

export default class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuFixed: false,
        };
    }

    componentDidMount() {
        window.onunload = () => {
            window.scrollTo({ top: 0, left: 0 });
        };
    }

  stickTopMenu = () => this.setState({ menuFixed: true });

  unStickTopMenu = () => this.setState({ menuFixed: false });

  render = () => {
      const { menuFixed } = this.state;

      return (
          <div>
              <TopMenu fixed={menuFixed} />
              <Home
                  onHeaderVisible={this.unStickTopMenu}
                  onHeaderPassed={this.stickTopMenu}
              />
              <About />
              <Resume />
              <Projects />
              <Image
                  src="/static/image/sections/section1.png"
                  style={{ width: '100%' }}
              />
          </div>
      );
  };
}
