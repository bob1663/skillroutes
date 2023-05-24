import React from "react";
import "./CardLoader.css";
import images from "../../constants/images";

const CardLoader = () => {
  return (
    <div className="app__cardLoader">
      <div className="app__cardLoader-category">
        <div className="app__cardLoader-category_icon"></div>
        <div className="app__cardLoader-category_text"></div>
      </div>
      <div className="app__cardLoader-user">
        <div className="app__cardLoader-user_icon"></div>
        <div className="app__cardLoader-user_text"></div>
      </div>
      <div className="app__cardLoader-info"></div>
      <div className="app__cardLoader-info"></div>
      <div className="app__cardLoader-diff"></div>
      <span className="custom-span"></span>
      <div className="app__cardLoader-rating">
        <img src={images.EyeIcon} alt="EyeIcon" />
        <div className="app__cardLoader-rating_views"></div>
        <span></span>
        <img src={images.StarIcon} alt="StarIcon" />
        <div className="app__cardLoader-rating_rate"></div>
      </div>
    </div>
  );
};

export default CardLoader;
