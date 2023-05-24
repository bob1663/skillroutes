import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { FiMenu } from "react-icons/fi";

import { isAuth } from "../../api/AuthContext.jsx";

const Navbar = () => {
  // --------------------------------------
  const [toggleMenu, setToggleMenu] = useState(false);
  // ------------------------------------------------------
  const [activeLink, setActiveLink] = useState(getActiveLinkFromStorage());
  function getActiveLinkFromStorage() {
    const storedLink = localStorage.getItem("activeLink");
    return storedLink ? storedLink : "/";
  }
  // ------------------------------------------------------
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isProfile = location.pathname === "/profile";
  const isRoadmap = location.pathname === "/roadmaps";

  // ------------------------------------------------------
  useEffect(() => {
    setActiveLink(location.pathname);
    localStorage.setItem("activeLink", location.pathname);
  }, [location.pathname]);
  // ------------------------------------------------------
  return (
    <div
      className={`app__navbar ${isHome || isProfile || isRoadmap ? "alt" : ""}`}
    >
      <div className="app__navbar-container">
        <div className="app__navbar-logo">
          <Link
            to="/"
            onClick={() => {
              setActiveLink("/");
              localStorage.setItem("activeLink", "/");
            }}
          >
            skillroutes
          </Link>
        </div>
        <div className="app__navbar-links">
          <Link
            to="/"
            className={`app__navbar-links_item ${
              activeLink === "/" ? "active" : ""
            }`}
            onClick={() => {
              setActiveLink("/");
              localStorage.setItem("activeLink", "/");
            }}
          >
            home
          </Link>
          <Link
            to="/roadmaps"
            className={`app__navbar-links_item ${
              activeLink === "/roadmaps" ? "active" : ""
            }`}
            onClick={() => {
              setActiveLink("/roadmaps");
              localStorage.setItem("activeLink", "/roadmaps");
            }}
          >
            roadmaps
          </Link>
          {isAuth() ? (
            <Link
              to="/profile"
              className={`app__navbar-links_item ${
                activeLink === "/profile" ? "active" : ""
              }`}
              onClick={() => {
                setActiveLink("/profile");
                localStorage.setItem("activeLink", "/profile");
              }}
            >
              profile
            </Link>
          ) : (
            <Link to="/login" className="signin-button">
              Log in
            </Link>
          )}
        </div>
      </div>
      <div className="app__navbar-smallscreen">
        {toggleMenu ? (
          <RiCloseLine
            color="#ffffff"
            size={32}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <FiMenu
            color="#ffffff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="app__navbar-smallscreen_links slide-bottom">
            <Link
              to="/"
              className={`app__navbar-smallscreen_links-item ${
                activeLink === "/" ? "active" : ""
              }`}
              onClick={() => {
                setActiveLink("/");
                localStorage.setItem("activeLink", "/");
                setToggleMenu(false);
              }}
            >
              home
            </Link>
            <span></span>
            <Link
              to="/roadmaps"
              className={`app__navbar-smallscreen_links-item ${
                activeLink === "/roadmaps" ? "active" : ""
              }`}
              onClick={() => {
                setActiveLink("/roadmaps");
                localStorage.setItem("activeLink", "/roadmaps");
                setToggleMenu(false);
              }}
            >
              roadmaps
            </Link>
            <span></span>
            {isAuth() ? (
              <Link
                to="/profile"
                className={`app__navbar-smallscreen_links-item ${
                  activeLink === "/profile" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveLink("/profile");
                  localStorage.setItem("activeLink", "/profile");
                  setToggleMenu(false);
                }}
              >
                profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="app__navbar-smallscreen_links-item"
                onClick={() => {
                  setToggleMenu(false);
                }}
              >
                log in
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
