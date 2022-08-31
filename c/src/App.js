import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import PageNotFound from "./pages/PageNotFound";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios.get("http://localhost:3001/users/auth",
      {
        headers: {
          accessToken: localStorage.getItem("accessToken")
        }
      }
    ).then((res) => {
      if (res.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({
          username: res.data.username,
          id: res.data.id,
          status: true,
        });
      }
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
            {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <>
                <Link to="/">Home</Link>
                <Link to="/createpost">Create Post</Link>
                <Link to="/contact">Contact</Link>
                
                
              </>
            )}   
            </div>  
            <div className="loggedInContainer">
            <Link to="/profile/1"> {authState.username} </Link>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>       
          </div>

          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/createpost" element={<CreatePost />} />
            <Route exact path="/post/:id" element={<Post />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
