import React, { useEffect, useRef, useState } from "react";
import "./Roadmap.css";
import { profileApi, roadmapId, saveRoadmap } from "../../api/api";
import { useParams } from "react-router-dom";
import images from "../../constants/images.js";
import AlertRoadmap from "../../components/AlertRoadmap/AlertRoadmap.jsx";
import { isAuth } from "../../api/AuthContext.jsx";
import { Loader } from "../../components";
import useResizer from "../../constants/isMobile.js";

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState([]);
  let { id } = useParams();
  const local = localStorage.getItem("Roadmap");
  const localRoadmaps = (JSON.parse(local));
  const [thisLocal,setThisLocal]=useState(null);
  useEffect(() => {
    const fetchRoadmaps = async () => {
      const data = await roadmapId(id);
      setRoadmap(data);
      const alertArray = data.blocks.map((block) =>
          Array.from({length: block.components.length}, () => false)
      );
      let saveLocal = true;
      if (localRoadmaps) {
      localRoadmaps.forEach((r) => {
        if (r.id == id) {
          saveLocal = false;
          setThisLocal(r);
        }
      });
    }
      if (saveLocal) {
        const newRoadmap = {
          id: data.roadmap_info.id,
          blocks: data.blocks.map((block) => ({
            id: block.id,
            components: block.components.map((component) => ({
              ...component,
              complete: false,
            })),
          })),
        };
        console.log(data)
        console.log(newRoadmap)
        setThisLocal(newRoadmap);
        const mergedRoadmaps = localRoadmaps
            ? [...localRoadmaps, newRoadmap]
            : [newRoadmap];
        localStorage.setItem("Roadmap", JSON.stringify(mergedRoadmaps));
      }
      setAlert(alertArray);
      setIsLoading(false);
    };
    fetchRoadmaps().then();
  }, []);
  const completeLocal = (index, m) => {
    console.log(thisLocal.blocks[index].components[m])
    const component = {
      ...thisLocal.blocks[index].components[m],
      complete: !thisLocal.blocks[index].components[m].complete
    }
    const updatedBlock = {components:[
      ...thisLocal.blocks[index].components.slice(0, m),
      component,
      ...thisLocal.blocks[index].components.slice(m+1)
    ]}
    const updatedBlocks = [
      ...thisLocal.blocks.slice(0, index),
        updatedBlock,
      ...thisLocal.blocks.slice(index + 1)
    ]
    const updatedRoadmap = {
      id: id,
      blocks: updatedBlocks
    }
    setThisLocal(updatedRoadmap);
    const updatedRoadmaps = localRoadmaps.map((r) => {
      console.log(r);
      console.log(updatedRoadmap)
      return r.id == updatedRoadmap.id ? updatedRoadmap : r
    })
    localStorage.setItem('Roadmap', JSON.stringify(updatedRoadmaps));
  }

  const [isSave, setIsSave] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuth()) {
        const data = await profileApi();
        data.profile.saved.map((p) => {
          if (p == id) {
            setIsSave(true);
          }
        });
      }
    };
    fetchProfile().then();
  }, []);
  const saveRoad = async () => {
    if (isAuth()) {
      saveRoadmap(id);
      setIsSave(!isSave);
    } else {
      window.location.href = "/login";
    }
  };
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
  const isMobile = useResizer();
  const middleRef = useRef(null);
  const [height, setHeight] = useState(300);
  const [windowHeight, setWindowHeight] = useState(1000);
  React.useEffect(() => {
    if (middleRef.current) {
      setWindowHeight(middleRef.current.getBoundingClientRect().height);
    }
  }, [windowHeight]);
  function handleSizeChange() {
    return setWindowHeight(window.innerHeight);
  }
  React.useEffect(() => {
    window.addEventListener("resize", handleSizeChange);
    return () => {
      window.removeEventListener("resize", handleSizeChange);
    };
  }, [windowHeight]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div className="roadmapId">
      <div className="roadmapId__navbar" />
      <div className="roadmapId__middle" ref={middleRef}>
        {!isLoading && (
          <div className="roadmapId__middle__centered">
            <div className="roadmapId__middle__centered__header">
              <div className="roadmapId__middle__centered__cat">
                <img src={roadmap.roadmap_info.cat.ico} alt="icon" />
                {roadmap.roadmap_info.cat.title}
              </div>
              <div className="roadmapId__middle__centered__profile">
                <img src={images.Icon} alt="icon" />
                {roadmap.roadmap_info.user}
              </div>
            </div>
            <div className="roadmapId__middle__centered__title">
              {roadmap.roadmap_info.title}
            </div>
            <div className="roadmapId__middle__centered__description">
              {roadmap.roadmap_info.description}
            </div>
            <div className="roadmapId__middle__centered__footer">
              <div className="roadmapId__middle__centered__footer__hours">
                <p>
                  {roadmap.roadmap_info.difficulty
                    ? roadmap.roadmap_info.difficulty
                    : "Beginner"}
                </p>
                <span></span>
                <p>~{roadmap.roadmap_info.estimated_hours}h</p>
              </div>
              <div className="roadmapId__middle__centered__footer__rating">
                {isSave ? (
                  <img
                    src={images.Saved}
                    onClick={saveRoad}
                    style={{ cursor: "pointer" }}
                    alt="EyeIcon"
                  />
                ) : (
                  <img
                    src={images.Save}
                    onClick={saveRoad}
                    style={{ cursor: "pointer" }}
                    alt="EyeIcon"
                  />
                )}
                <img src={images.EyeIcon} alt="EyeIcon" />
                <p>2281</p>
                <span></span>
                <img src={images.StarIcon} alt="StarIcon" />
                <p>{roadmap.roadmap_info.average_rating}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className="roadmapId__blocks_menu"
        style={
          isMobile ? { marginTop: 120 + height } : { marginTop: 50 + height }
        }
      >
        {!isLoading &&
          roadmap.blocks.map((block, index) => (
            <div
              className="roadmapId__block"
              key={block.id}
              style={{ maxHeight: windowHeight - height - 150 }}
            >
              <div className="roadmapId__block__header">{block.title}</div>
              <div className="roadmapId__block__description">
                {block.description}
              </div>
              <progress
                  max={thisLocal.blocks[index].components.length}
                  value={thisLocal.blocks[index].components.filter(c => c.complete).length}
              />
              {block.components && (
                <div className="roadmapId__component">
                  Components
                  {block.components.map((component, m) => (<>
                      {alert[index][m] && (
                        <AlertRoadmap
                          index={index}
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
                        <span >{component.title.length > 35
                          ? component.title.slice(0, 35) + "..."
                          : component.title}</span>
                        <img
                            src={thisLocal.blocks[index].components[m].complete?images.Complete:images.UnComplete}
                            onClick={(e) => {
                              e.stopPropagation();
                              completeLocal(index, m);
                            }}
                            alt="Complete"
                            className="roadmapId__block--img"
                        />
                      </div>
                    </>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Roadmap;
