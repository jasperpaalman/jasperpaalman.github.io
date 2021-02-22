import React from "react";
import About from "../components/sections/About";
import Eredivisie from "../components/sections/Eredivisie";

const Home = () => (
  <div
    style={{
      "margin-top": "32pt",
      "margin-right": "5pt",
      "margin-left": "5pt",
    }}
  >
    <About />
    <Eredivisie />
  </div>
);

export default Home;
