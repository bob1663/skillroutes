import React from "react";
import "./Footer.css";
import images from "../../constants/images";

const Footer = () => {
  return (
    <div className="app__footer">
      <div className="app__footer-contact">
        <h4>Terms and conditions</h4>
        <h4>Contact</h4>
      </div>
      <div className="app__footer-social">
        <img src={images.Instagram} alt="Instagram" />
        <img src={images.YouTube} alt="YouTube" />
        <img src={images.Discord} alt="Discord" />
        <img src={images.Twitter} alt="Twitter" />
        <img src={images.Facebook} alt="Facebook" />
      </div>
      <p>© 2023 Saton team</p>
    </div>
  );
};

export default Footer;
