import React, { Component } from 'react';

import { Image } from 'semantic-ui-react';

import BasicBlock from '../elements/block';

import NeuralNetwork from '../layout/NeuralNetwork';
import Line from '../layout/Line';

import TopMenu from '../layout/TopMenu';
import Home from '../sections/Home';
import About from '../sections/About';
import Resume from '../sections/Resume';
import Projects from '../sections/Projects';

import scrollToElement from '../../utils/scrollToElement';

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

        window.onload = () => {
            this.scrollToHash();
        };
    }

  scrollToHash = () => {
      if (window.location.hash) {
          const { hash } = window.location;
          const elem = document.querySelector(hash);

          if (elem !== null) {
              scrollToElement(elem);
          }
      }
  };

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
              <NeuralNetwork />
              <About />
              <BasicBlock />
              <Resume />
              <Line />
              <Projects />
              <Image src="/static/image/layout/end.png" style={{ width: '100%' }} />
          </div>
      );
  };
}
