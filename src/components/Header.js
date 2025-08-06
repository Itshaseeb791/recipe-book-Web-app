import React from "react";
import chefImage from "../assets/chef.png";

const Header = () => (
  <div className="header">
    <img src={chefImage} alt="Chef" className="chef-img" />
    <div className="title-group">
    <h1>🍳 AI Chef GPT</h1>
      <p className="tagline">Your personal recipe assistant, powered by AI.</p>
    </div>
  </div>
);

export default Header;
