import React, { useEffect, useState } from "react";
import "./Profile.css";
import { clearStorages } from "../../api/tokenStorage";
import images from "../../constants/images.js";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardLoader, Loader } from "../../components/index.js";
import { editProfileApi, profileApi, roadmapId } from "../../api/api.js";
import { isAuth } from "../../api/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmapsSave, setRoadmapsSave] = useState([]);
  const [createdActive, setCreatedActive] = useState(true);
  const [favoriteActive, setFavoriteActive] = useState(false);
  const [user, setUser] = useState();
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    if (!isAuth()) {
      window.location.href = "/login";
    }
  }, [isAuth()]);

  const logOut = () => {
    clearStorages();
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await profileApi();
      setUser(data);
      const sortedData = data.roadmaps.sort(
        (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
      );
      setRoadmaps(sortedData);
      let roads = [];
      const fetchRoads = async () => {
        const promises = data.profile.saved.map(async (id) => {
          const road = await roadmapId(id);
          return road.roadmap_info;
        });
        roads = await Promise.all(promises);
        setRoadmapsSave(roads);
      };
      fetchRoads();
      setIsLoading(false);
    };
    fetchData();
  }, []);
  const [newDescription, setNewDescription] = useState("");

  const handleSave = async () => {
    await editProfileApi(user.profile.name, newDescription);
    setUser((prevUser) => ({
      ...prevUser,
      profile: {
        ...prevUser.profile,
        description: newDescription,
      },
    }));
    setIsEditingDescription(false);
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 250) {
      setNewDescription(e.target.value);
    }
  };

  useEffect(() => {
    if (user && isEditingDescription) {
      setNewDescription(user.profile.description);
    }
  }, [user, isEditingDescription]);

  return (
    <div className="app__profile">
      <div className="app__profile-user">
        {isLoading ? (
          <div className="loading-screen">
            <Loader />
          </div>
        ) : (
          <>
            <div className="app__profile-user_gradient">
              <button onClick={logOut}>
                <img src={images.Logout} alt="Logout" />
              </button>
            </div>
            <div className="app__profile-user_info">
              <div className="app__profile-user_info-wrapper">
                <div className="app__profile-user_info-avatar">
                  <img src={images.Photo} alt="Profile Picture" />
                </div>
                <div className="app__profile-user_info-nickname">
                  <p>{user && user.profile.name}</p>
                  <img
                    src={images.Pencil}
                    alt="Pencil"
                    onClick={() => setIsEditingDescription(true)}
                  />
                </div>

                {!isEditingDescription ? (
                  <p className="app__profile-user_info-description_text">
                    {user && user.profile.description}
                  </p>
                ) : (
                  <div className="app__profile-user_info-description">
                    <textarea
                      value={newDescription}
                      onChange={handleDescriptionChange}
                    ></textarea>
                    <button type="submit" onClick={handleSave}>
                      Save
                    </button>
                  </div>
                )}
              </div>
              <Link to="/roadmap/create" className="create-roadmap">
                Create Roadmap
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="app__profile-roadmaps">
        <div className="app__profile-roadmaps_filters">
          <img src={images.Vitalikdaun} alt="Vitalikdaun" />
          <div
            className={`app__profile-roadmaps_filters-wrapper ${
              createdActive ? "active" : ""
            }`}
            onClick={() => {
              setCreatedActive(true);

              setFavoriteActive(false);
            }}
          >
            <h5>Created Roadmaps</h5>
          </div>
          <div
            className={`app__profile-roadmaps_filters-wrapper ${
              favoriteActive ? "active" : ""
            }`}
            onClick={() => {
              setCreatedActive(false);
              setFavoriteActive(true);
            }}
          >
            <h5>Saved Roadmaps</h5>
          </div>
        </div>
        <div className="app__profile-roadmaps_wrapper">
          <div className="app__profile-roadmaps_container">
            <p className="total">
              Total: {createdActive ? roadmaps.length : roadmapsSave.length}
            </p>
            <div className="profile__roadmaps_cards">
              {isLoading ? (
                Array.from({ length: 4 }, (_, index) => (
                  <CardLoader key={index} />
                ))
              ) : (
                <>
                  {createdActive
                    ? roadmaps.map((roadmap) => (
                        <Link to={`/roadmap/${roadmap.id}`} key={roadmap.id}>
                          <Card key={roadmap.id} data={roadmap} />
                        </Link>
                      ))
                    : roadmapsSave &&
                      roadmapsSave.map((roadmap) => (
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
    </div>
  );
};

export default Profile;
