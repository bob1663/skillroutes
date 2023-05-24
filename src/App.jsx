import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Footer, Navbar } from "./components";
import {
  Main,
  Profile,
  Roadmaps,
  Login,
  Register,
  Roadmap,
  Create,
} from "./pages";

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isProfilePage = location.pathname === "/profile";
  const isRoadmapId = location.pathname.includes("/roadmap/");
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" exact element={<Main />} />
          <Route path="/roadmaps" exact element={<Roadmaps />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/roadmap/:id" exact element={<Roadmap />} />
          <Route path="/roadmap/create" exact element={<Create />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isLoginPage && !isRegisterPage && !isProfilePage && !isRoadmapId && (
        <Footer className="foooter" />
      )}
    </>
  );
};

const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
};

export default App;
