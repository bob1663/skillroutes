import React, { useState, useEffect } from "react";
import "./Main.css";

import { CardLoader, Searchbar, Card } from "../../components";

import { roadmapListApiSort } from "../../api/api";
import { Link } from "react-router-dom";

const Main = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchRoadmaps = async () => {
      const data = await roadmapListApiSort();
      setRoadmaps(data);
      setIsLoading(false);
    };
    fetchRoadmaps().then();
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  return (
    <div className="app__main">
      <div className="app__main-header">
        <h1>
          Improve Your Skills with <span>SkillRoutes</span>
        </h1>
        <h3>Discover Roadmaps to Achieve Your Professional Goals</h3>
        <h4>
          <span>Find</span> Roadmaps for Your Dream Career
        </h4>
        {/* БЛОК ДЛЯ SEARCHBAR */}
        <div className="app__main-searchbar">
          <Searchbar />
        </div>
      </div>
      <div className="app__main-roadmaps">
        <div className="app__main-roadmaps_article">
          <span></span>
          <p>Popular Roadmaps</p>
          <span></span>
        </div>
        {/* БЛОК ДЛЯ КАРТОЧОК */}
        <div className="app__main-roadmaps_cards">
          {isLoading ? (
            Array.from({ length: 8 }, (_, index) => <CardLoader key={index} />)
          ) : (
            <>
              {roadmaps.slice(0, 8).map((roadmap) => (
                <Link to={`/roadmap/${roadmap.id}`} key={roadmap.id}>
                  <Card data={roadmap} />
                </Link>
              ))}
            </>
          )}
        </div>
        <Link to="/roadmaps" className="load-more" onClick={goToTop}>
          See more...
        </Link>
      </div>
    </div>
  );
};

export default Main;
