import React from "react";
import * as PropTypes from "prop-types";
import { Visibility } from "semantic-ui-react";
import BannerSVG from "../../assets/image/home_banner.svg";
import "./Home.scss";

const Home = ({ onHeaderPassed, onHeaderVisible }) => (
  <div id="home">
    <Visibility
      onBottomPassed={onHeaderPassed}
      onBottomVisible={onHeaderVisible}
      once={false}
    />
    <div id="banner">
      <span dangerouslySetInnerHTML={{ __html: BannerSVG }} />
    </div>
  </div>
);

Home.propTypes = {
  onHeaderPassed: PropTypes.any.isRequired,
  onHeaderVisible: PropTypes.any.isRequired,
};

export default Home;
