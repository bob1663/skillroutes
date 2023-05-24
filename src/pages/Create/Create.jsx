import React, { useState, useEffect, useRef } from "react";
import "../Roadmap/Roadmap.css";
import { createRoadmapApi, profileApi } from "../../api/api.js";
import images from "../../constants/images.js";
import AlertCreate from "../../components/AlertCreate/AlertCreate.jsx";
import { useNavigate } from "react-router-dom";
import {isAuth} from "../../api/AuthContext.jsx";
import useResizer from "../../constants/isMobile.js";
const Create = () => {
  const isMobile=useResizer();
  useEffect(() => {
    if (!isAuth()) {
      window.location.href = "/login";
    }
  }, [isAuth()]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(1);
  const maxHours=(e)=>{
    if(e.target.value.length<5&&!isNaN(e.target.value)) {
      setHours(e.target.value)
    }
  }
  const [blocks, setBlocks] = useState([
    {
      title: "",
      description: "",
      components: [],
    },
  ]);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cat, setSelectedOption] = useState(1);
  const [isDropdownLvl, setIsDropdownLvl] = useState(false);
  const [difficulty, setSelectedLvl] = useState(1);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };
  const handleOptionLvl = (option) => {
    setSelectedLvl(option);
    setIsDropdownLvl(false);
  };
  const [alert, setAlert] = useState([]);
  const handleAlertChange = (index, m, bool) => {
    setAlert((prevState) => {
      return prevState.map((alertRow, rowIndex) => {
        if (rowIndex === index) {
          return alertRow.map(
            (alertValue, valueIndex) => valueIndex === m && bool
          );
        } else {
          return alertRow.map(() => false);
        }
      });
    });
  };
  const middleRef = useRef(null);
  const [height, setHeight] = useState(300);
  const [windowHeight,setWindowHeight]=useState(1000);
  useEffect(() => {
    if(middleRef.current) {
      setHeight(middleRef.current.getBoundingClientRect().height);
    }
  }, [blocks]);
  useEffect(() => {
    setWindowHeight(window.innerHeight)
  }, [window.innerHeight]);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await profileApi();
      setProfile(data.profile.name);
    };
    fetchData().then();
  }, []);


  const createRoadmap = async () => {
    const good = await createRoadmapApi(
      blocks,
      cat,
      title,
      description,
      difficulty,
      hours
    );
    navigate("/roadmap/" + good.id);
  };

  const newBlock = () => {
    const alertArray = blocks.map((block) =>
      Array.from({ length: block.components.length }, () => false)
    );
    setAlert(alertArray);
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        title: "",
        description: "",
        components: [],
      },
    ]);
  };
  const deleteBlock = (index) => {
    const newBlocks = blocks.filter((block, i) => i !== index);
    setBlocks(newBlocks);
  };
  const setTitleBlock = (e, index) => {
    const newBlocks = [...blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      title: e.target.value,
    };
    setBlocks(newBlocks);
  };
  const setDescriptionBlock = (e, index) => {
    const newBlocks = [...blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      description: e.target.value,
    };
    setBlocks(newBlocks);
  };
  const setTitleComponent = (e, index, m) => {
    const newBlocks = [...blocks];
    newBlocks[index].components[m] = {
      ...newBlocks[index].components[m],
      title: e,
    };
    setBlocks(newBlocks);
  };
  const setComponent = (component, index, m) => {
    let newBlocks = [...blocks];
    newBlocks[index].components[m] = component;
    setBlocks(newBlocks);
  };
  const [indexComp, setIndex] = useState(0);
  const newComponent = (index) => {
    const alertArray = blocks.map((block) =>
      Array.from({ length: block.components.length + 1 }, () => false)
    );
    setAlert(alertArray);
    setIndex(indexComp + 1);
    const newBlock = { ...blocks[index] };
    newBlock.components.push({
      title: "Title",
      id: indexComp,
      block: indexComp,
    });
    const newBlocks = [...blocks];
    newBlocks[index] = newBlock;
    setBlocks(newBlocks);
  };
  const deleteComponent = (index, m) => {
    const newBlock = { ...blocks[index] };
    newBlock.components.splice(m, 1);
    const newBlocks = [...blocks];
    newBlocks[index] = newBlock;
    setBlocks(newBlocks);
  };
  const regexDescription = (e) => {
    if(e.target.value.length<250){
    setDescription(e.target.value);
    }
  };
  return (
    <>
      <div className="roadmapId">
        <div className="roadmapId__navbar" />
        <div className="roadmapId__middle" ref={middleRef}>
          <div className="roadmapId__middle__centered">
            <div className="roadmapId__middle__centered__header">
              <div className="roadmapId__middle__centered__cat">
                <div className="roadmapId__dropdown">
                  <div
                    className="roadmapId__dropdown"
                    onClick={() => {
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                  >
                    <img
                      src={
                        cat === 1
                          ? "https://cdn.discordapp.com/attachments/1072566276226031676/1103277739605237831/Group_56.webp"
                          : cat === 2
                          ? "https://cdn.discordapp.com/attachments/1072566276226031676/1103277739076763748/Group_55.webp"
                          : cat === 3
                          ? "https://cdn.discordapp.com/attachments/1072566276226031676/1103277740003688548/Group_57.webp"
                          : cat === 4
                          ? "https://cdn.discordapp.com/attachments/1072566276226031676/1103277741001932921/icon.webp"
                          : cat === 5
                          ? "https://cdn.discordapp.com/attachments/1072566276226031676/1103277738707656715/Group_54.webp"
                          : cat === 6
                          ? "https://cdn.discordapp.com/attachments/1072566276226031676/1103277741412991077/Group_53.webp"
                          : "https://cdn.discordapp.com/attachments/1072566276226031676/1103277740624461915/icon-1.webp"
                      }
                      alt="icon"
                    />
                    <span style={{ marginLeft: 8 }}>
                      {" "}
                      {cat === 1
                        ? "Frontend"
                        : cat === 2
                        ? "Backend"
                        : cat === 3
                        ? "DevOps"
                        : cat === 4
                        ? "Android"
                        : cat === 5
                        ? "Computer Science"
                        : cat === 6
                        ? "Data Science"
                        : "UI/UX Design"}{" "}
                    </span>
                    <img
                      src={images.EditArrow}
                      alt="ArrowDownFilter"
                      className="roadmapId__dropdown__arrow"
                      style={{
                        width: 16,
                        height: 10,
                        marginLeft: 8,
                        marginTop: 10,
                      }}
                    />
                  </div>
                  <div
                    className={`roadmapId__dropdown-cat ${
                      isDropdownOpen ? "open" : ""
                    }`}
                  >
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionClick(1)}
                    >
                      <p>Frontend</p>
                    </div>
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionClick(2)}
                    >
                      <p>Backend</p>
                    </div>
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionClick(3)}
                    >
                      <p>DevOps</p>
                    </div>
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionClick(4)}
                    >
                      <p>Android</p>
                    </div>
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionClick(5)}
                    >
                      <p>Computer Science</p>
                    </div>
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionClick(6)}
                    >
                      <p>Data Science</p>
                    </div>
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionClick(7)}
                    >
                      <p>UI/UX Design</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="roadmapId__middle__centered__profile">
                <img src={images.Icon} alt="icon" />
                {profile}
              </div>
            </div>
            <textarea
              className="roadmapId__middle__centered__title create__title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Title"
              value={title}
            />
            <textarea
              className="roadmapId__middle__centered__description__text"
              onChange={(e) => {
                regexDescription(e)
              }}
              placeholder="Description"
              value={description}
            />
            <div className="roadmapId__middle__centered__footer">
              <div className="roadmapId__middle__centered__footer__hours">
                <div className="roadmapId__dropdown__lvl">
                  <div
                    className="roadmapId__dropdown__lvl"
                    onClick={() => {
                      setIsDropdownLvl(!isDropdownLvl);
                    }}
                  >
                    <span>
                      {" "}
                      {difficulty === 1
                        ? "Beginner"
                        : difficulty === 2
                        ? "Intermediate"
                        : "Advanced"}{" "}
                    </span>
                    <img
                      src={images.EditArrow}
                      alt="ArrowDownFilter"
                      className="roadmapId__dropdown__lvl__arrow"
                      
                    />
                  </div>
                  <div
                    className={`roadmapId__dropdown__lvl-cat ${
                      isDropdownLvl ? "open" : ""
                    }`}
                  >
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionLvl(1)}
                    >
                      <p>Beginner</p>
                    </div>
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionLvl(2)}
                    >
                      <p>Intermediate</p>
                    </div>
                    <div
                      className="roadmapId__dropdown-cat-wrapper"
                      onClick={() => handleOptionLvl(3)}
                    >
                      <p>Advanced</p>
                    </div>
                  </div>
                </div>
                <span></span>
                <p className="hours__create-l">
                  Hours:
                  <textarea
                    className="roadmapId__middle__centered__hours hours__create-r"
                    onChange={(e) => {
                      maxHours(e);
                    }}
                    value={hours}
                  />
                </p>
              </div>
              <div
                className="roadmapId__middle__button"
                onClick={createRoadmap}
              >
                Create
              </div>
            </div>
          </div>
        </div>
        <div
          className="roadmapId__blocks_menu"
          style={{ marginTop: 100 + height}}
        >
          {blocks.map((block, index) => (
            <div className="roadmapId__block" key={block.id}
                 style={{maxHeight:windowHeight-height-150}}>
              <textarea
                className="roadmapId__block__text__create"
                onChange={(e) => {
                  setTitleBlock(e, index);
                }}
                placeholder='Title'
                value={block.title}
              />
              <img
                  src={images.Delete}
                  alt="delete"
                  className="roadmapId__block--delete"
                  onClick={() => {
                    deleteBlock(index);
                  }}
              />
              <textarea
                className="roadmapId__block__text__description__create"
                onChange={(e) => {
                  setDescriptionBlock(e, index);
                }}
                placeholder="Description"
                value={block.description}
              />
              {block.components && (
                <div className="roadmapId__component__create">
                  Components
                  {block.components.map((component, m) => (
                    <>
                      {alert[index][m] && (
                        <AlertCreate
                          setTitleComponent={setTitleComponent}
                          index={index}
                          setComponent={setComponent}
                          m={m}
                          handleAlert={handleAlertChange}
                          component={component}
                        />
                      )}
                      <div
                        className={"roadmapId__component__info"}
                        onClick={() => {
                          handleAlertChange(index, m, true);
                        }}
                      >
                        {component.title}
                        <img
                            src={images.Delete}
                            alt="delete"
                            className="roadmapId__block--img"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteComponent(index,m);
                            }}
                        />
                        <img
                            src={images.Edit}
                            alt="edit"
                            className="roadmapId__block--img"
                        />
                      </div>
                    </>
                  ))}
                  <div className={"roadmapId__component__info"}>
                    <img
                      src={images.Add}
                      alt="add"
                      className="roadmapId__block--img"
                      onClick={() => {
                        newComponent(index);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="roadmapId__block__new"
          >
            <img
                src={images.Add}
                alt="add"
                className="roadmapId__block--img"
                onClick={() => {
                  newBlock();
                }}
            />
        </div>
        </div>
      </div>
    </>
  );
};

export default Create;
