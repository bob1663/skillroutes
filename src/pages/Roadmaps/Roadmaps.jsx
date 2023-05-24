import React, { useState, useEffect } from "react";
import "./Roadmaps.css";
import { CardLoader, Searchbar, Card } from "../../components";
import images from "../../constants/images";
import { roadmapListApi } from "../../api/api";
import { Link } from "react-router-dom";

const Roadmaps = () => {
  const [baseRoadmap, setRoadmap] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("By Rating");
  const [searchValue, setSearchValue] = useState("");

  const [isDiffDropdownOpen, setIsDiffDropdownOpen] = useState(false);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  // --------------------------------------------------------
  const [ratingFilters, setRatingFilters] = useState([]);
  const [difficultyFilters, setDifficultyFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [timeFilters, setTimeFilters] = useState([]);
  const [roadmapLength, setLength] = useState(0);
  const handleSearch = (e) => {
    setSearchValue(e);
  };
  useEffect(() => {
    const fetchRoadmaps = async () => {
      const data = await roadmapListApi();
      setRoadmap(data);
      setRoadmaps(data);
      setIsLoading(false);
      setLength(data.length);
    };
    fetchRoadmaps();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDiffDropdown = () => {
    setIsDiffDropdownOpen(!isDiffDropdownOpen);
  };

  const toggleRatingDropdown = () => {
    setIsRatingDropdownOpen(!isRatingDropdownOpen);
  };

  const toggleTimeDropdown = () => {
    setIsTimeDropdownOpen(!isTimeDropdownOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  // -----------------------------------------------------------------------------
  const handleRatingChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setRatingFilters([...ratingFilters, value]);
    } else {
      setRatingFilters(ratingFilters.filter((filter) => filter !== value));
    }
  };

  const handleDifficultyChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setDifficultyFilters([...difficultyFilters, value]);
    } else {
      setDifficultyFilters(
        difficultyFilters.filter((filter) => filter !== value)
      );
    }
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setCategoryFilters([...categoryFilters, value]);
    } else {
      setCategoryFilters(categoryFilters.filter((filter) => filter !== value));
    }
  };

  const handleTimeChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setTimeFilters([...timeFilters, value]);
    } else {
      setTimeFilters(timeFilters.filter((filter) => filter !== value));
    }
  };

  useEffect(() => {
    let filteredRoadmaps = baseRoadmap;
    if (ratingFilters.length > 0) {
      filteredRoadmaps = filteredRoadmaps.filter((roadmap) => {
        for (const filter of ratingFilters) {
          switch (filter) {
            case "<1":
              if (roadmap.average_rating < 1) return true;
              break;
            case "1-2":
              if (roadmap.average_rating >= 1 && roadmap.average_rating < 2)
                return true;
              break;
            case "2-3":
              if (roadmap.average_rating >= 2 && roadmap.average_rating < 3)
                return true;
              break;
            case "3-4":
              if (roadmap.average_rating >= 3 && roadmap.average_rating < 4)
                return true;
              break;
            case ">4":
              if (roadmap.average_rating >= 4) return true;
              break;
          }
        }
        return false;
      });
    }
    if (difficultyFilters.length > 0) {
      filteredRoadmaps = filteredRoadmaps.filter((roadmap) =>
        difficultyFilters.includes(roadmap.difficulty)
      );
    }
    if (categoryFilters.length > 0) {
      filteredRoadmaps = filteredRoadmaps.filter((roadmap) =>
        categoryFilters.includes(roadmap.cat.title)
      );
    }
    if (timeFilters.length > 0) {
      filteredRoadmaps = filteredRoadmaps.filter((roadmap) => {
        for (const filter of timeFilters) {
          switch (filter) {
            case "<24":
              if (roadmap.estimated_hours < 24) return true;
              break;
            case "24-48":
              if (roadmap.estimated_hours >= 24 && roadmap.estimated_hours < 48)
                return true;
              break;
            case "48-72":
              if (roadmap.estimated_hours >= 48 && roadmap.estimated_hours < 72)
                return true;
              break;
            case ">72":
              if (roadmap.estimated_hours >= 72) return true;
              break;
          }
        }
        return false;
      });
    }
    if (searchValue) {
      filteredRoadmaps = filteredRoadmaps.filter((roadmap) => {
        const title = roadmap.title.toLowerCase();
        const description = roadmap.description.toLowerCase();
        const search = searchValue.toLowerCase();
        return title.includes(search) || description.includes(search);
      });
    }
    switch (selectedOption) {
      case "By Rating":
        filteredRoadmaps.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case "By Time":
        filteredRoadmaps.sort((a, b) => b.estimated_hours - a.estimated_hours);
        break;
      case "By Recent Upload":
        filteredRoadmaps.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA;
        });
        break;
      case "By Difficulty":
        filteredRoadmaps.sort((a, b) => {
          const difficulties = ["Easy", "Normal", "Hard"];
          const difficultyA = difficulties.indexOf(a.difficulty);
          const difficultyB = difficulties.indexOf(b.difficulty);
          return difficultyA - difficultyB;
        });
        break;
    }
    setLength(filteredRoadmaps.length);
    setRoadmaps([...filteredRoadmaps]);
  }, [
    searchValue,
    timeFilters,
    categoryFilters,
    difficultyFilters,
    ratingFilters,
    selectedOption,
  ]);

  const handleClearFilters = () => {
    setRatingFilters([]);
    setDifficultyFilters([]);
    setCategoryFilters([]);
    setTimeFilters([]);

    setIsDiffDropdownOpen(false);
    setIsRatingDropdownOpen(false);
    setIsTimeDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsFilterOpen(false);
  };
  return (
    <div className="app__roadmaps">
      <div className="app__roadmaps-searchbar">
        <Searchbar value={searchValue} handleSearch={handleSearch} />
        <div className="app__roadmaps-searchbar_filters">
          <p
            className={`${isFilterOpen ? "open" : ""}`}
            onClick={handleClearFilters}
          >
            Clear filters <img src={images.CrossIcon} alt="CrossIcon" />
          </p>
          <button onClick={toggleFilter}>
            Filters <img src={images.FilterIcon} alt="FilterIcon" />
          </button>
        </div>
      </div>
      <div className={`app__roadmaps-filter ${isFilterOpen ? "open" : ""}`}>
        <div className="app__roadmaps-filter_container">
          <div className="app__roadmaps-filter_rating">
            <button
              onClick={toggleRatingDropdown}
              className={isRatingDropdownOpen ? "active" : ""}
            >
              Rating <img src={images.ArrowDownFilter} alt="ArrowDownFilter" />
            </button>
            <div
              className={`app__roadmaps-filter_rating-dropdown ${
                isRatingDropdownOpen ? "open" : ""
              }`}
            >
              <div className="app__roadmaps-filter_rating-dropdown_wrapper">
                <label>
                  &lt;1
                  <input
                    type="checkbox"
                    value="<1"
                    onChange={handleRatingChange}
                    checked={ratingFilters.includes("<1")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_rating-dropdown_wrapper">
                <label>
                  1-2
                  <input
                    type="checkbox"
                    value="1-2"
                    onChange={handleRatingChange}
                    checked={ratingFilters.includes("1-2")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_rating-dropdown_wrapper">
                <label>
                  2-3
                  <input
                    type="checkbox"
                    value="2-3"
                    onChange={handleRatingChange}
                    checked={ratingFilters.includes("2-3")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_rating-dropdown_wrapper">
                <label>
                  3-4
                  <input
                    type="checkbox"
                    value="3-4"
                    onChange={handleRatingChange}
                    checked={ratingFilters.includes("3-4")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_rating-dropdown_wrapper">
                <label>
                  &gt;4
                  <input
                    type="checkbox"
                    value=">4"
                    onChange={handleRatingChange}
                    checked={ratingFilters.includes(">4")}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="app__roadmaps-filter_difficulty">
            <button
              onClick={toggleDiffDropdown}
              className={isDiffDropdownOpen ? "active" : ""}
            >
              Difficulty{" "}
              <img src={images.ArrowDownFilter} alt="ArrowDownFilter" />
            </button>

            <div
              className={`app__roadmaps-filter_difficulty-dropdown ${
                isDiffDropdownOpen ? "open" : ""
              }`}
            >
              <div className="app__roadmaps-filter_difficulty-dropdown_wrapper">
                <label>
                  Easy
                  <input
                    type="checkbox"
                    value="Easy"
                    onChange={handleDifficultyChange}
                    checked={difficultyFilters.includes("Easy")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_difficulty-dropdown_wrapper">
                <label>
                  Normal
                  <input
                    type="checkbox"
                    value="Normal"
                    onChange={handleDifficultyChange}
                    checked={difficultyFilters.includes("Normal")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_difficulty-dropdown_wrapper">
                <label>
                  Hard
                  <input
                    type="checkbox"
                    value="Hard"
                    onChange={handleDifficultyChange}
                    checked={difficultyFilters.includes("Hard")}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="app__roadmaps-filter_category">
            <button
              onClick={toggleCategoryDropdown}
              className={isCategoryDropdownOpen ? "active" : ""}
            >
              Category{" "}
              <img src={images.ArrowDownFilter} alt="ArrowDownFilter" />
            </button>
            <div
              className={`app__roadmaps-filter_category-dropdown ${
                isCategoryDropdownOpen ? "open" : ""
              }`}
            >
              <div className="app__roadmaps-filter_category-dropdown_wrapper">
                <label>
                  Frontend
                  <input
                    type="checkbox"
                    value="Frontend"
                    onChange={handleCategoryChange}
                    checked={categoryFilters.includes("Frontend")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_category-dropdown_wrapper">
                <label>
                  Backend
                  <input
                    type="checkbox"
                    value="Backend"
                    onChange={handleCategoryChange}
                    checked={categoryFilters.includes("Backend")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_category-dropdown_wrapper">
                <label>
                  DevOps
                  <input
                    type="checkbox"
                    value="DevOps"
                    onChange={handleCategoryChange}
                    checked={categoryFilters.includes("DevOps")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_category-dropdown_wrapper">
                <label>
                  Android
                  <input
                    type="checkbox"
                    value="Android"
                    onChange={handleCategoryChange}
                    checked={categoryFilters.includes("Android")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_category-dropdown_wrapper">
                <label>
                  Computer Science
                  <input
                    type="checkbox"
                    value="Computer Science"
                    onChange={handleCategoryChange}
                    checked={categoryFilters.includes("Computer Science")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_category-dropdown_wrapper">
                <label>
                  Data Science
                  <input
                    type="checkbox"
                    value="Data Science"
                    onChange={handleCategoryChange}
                    checked={categoryFilters.includes("Data Science")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_category-dropdown_wrapper">
                <label>
                  UI/UX Design
                  <input
                    type="checkbox"
                    value="UI/UX Design"
                    onChange={handleCategoryChange}
                    checked={categoryFilters.includes("UI/UX Design")}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="app__roadmaps-filter_time">
            <button
              onClick={toggleTimeDropdown}
              className={isTimeDropdownOpen ? "active" : ""}
            >
              Estimated time{" "}
              <img src={images.ArrowDownFilter} alt="ArrowDownFilter" />
            </button>
            <div
              className={`app__roadmaps-filter_time-dropdown ${
                isTimeDropdownOpen ? "open" : ""
              }`}
            >
              <div className="app__roadmaps-filter_time-dropdown_wrapper">
                <label>
                  &lt;24h
                  <input
                    type="checkbox"
                    value="<24"
                    onChange={handleTimeChange}
                    checked={timeFilters.includes("<24")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_time-dropdown_wrapper">
                <label>
                  24h-48h
                  <input
                    type="checkbox"
                    value="24-48"
                    onChange={handleTimeChange}
                    checked={timeFilters.includes("24-48")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_time-dropdown_wrapper">
                <label>
                  48h-72h
                  <input
                    type="checkbox"
                    value="48-72"
                    onChange={handleTimeChange}
                    checked={timeFilters.includes("48-72")}
                  />
                </label>
              </div>
              <div className="app__roadmaps-filter_time-dropdown_wrapper">
                <label>
                  &gt;72h
                  <input
                    type="checkbox"
                    value=">72"
                    onChange={handleTimeChange}
                    checked={timeFilters.includes(">72")}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="app__roadmaps-cards">
        <div className="app__roadmaps-cards_container">
          <div className="app__roadmaps-cards_info">
            <p>{roadmapLength} results</p>
            <div className="dropdown">
              <button onClick={toggleDropdown}>
                {selectedOption}{" "}
                <img src={images.ArrowDownFilter} alt="ArrowDownFilter" />
              </button>
              <div className={`dropdown-sort ${isDropdownOpen ? "open" : ""}`}>
                <div
                  className="dropdown-sort-wrapper"
                  onClick={() => handleOptionClick("By Rating")}
                >
                  <p>By Rating</p>
                </div>
                <div
                  className="dropdown-sort-wrapper"
                  onClick={() => handleOptionClick("By Difficulty")}
                >
                  <p>By Difficulty</p>
                </div>
                <div
                  className="dropdown-sort-wrapper"
                  onClick={() => handleOptionClick("By Recent Upload")}
                >
                  <p>By Recent Upload</p>
                </div>
                <div
                  className="dropdown-sort-wrapper"
                  onClick={() => handleOptionClick("By Time")}
                >
                  <p>By Time</p>
                </div>
              </div>
            </div>
          </div>
          <div className="app__main-roadmaps_cards">
            {isLoading ? (
              Array.from({ length: 12 }, (_, index) => (
                <CardLoader key={index} />
              ))
            ) : (
              <>
                {roadmaps.map((roadmap) => (
                  <Link to={`/roadmap/${roadmap.id}`} key={roadmap.id}>
                    <Card key={roadmap.id} data={roadmap} />
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
