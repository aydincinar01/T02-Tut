import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setAuthState} = useContext(AuthContext);
  let navigate = useNavigate();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/users/login", data).then((res) => {

      if (res.data.error) {
        alert("HOOOPPP !");
      }
      else {
        localStorage.setItem("accessToken", res.data.token);
        setAuthState({
          username: res.data.username,
          id: res.data.id,
          status: true,
        });
        navigate("/");
      }       
    });
  };

  return (
    <div className="loginForm">
      <label>Username: </label>
      <input
        autoComplete="off"
        id="username"
        name="username"
        placeholder="username..."
        onChange={(e) => { setUsername(e.target.value) }}
      />
      <label>Password: </label>
      <input
        autoComplete="off"
        id="password"
        name="password"
        type="password"
        placeholder="password"
        onChange={(e) => { setPassword(e.target.value) }}
      />
      <button type="submit" onClick={login}> Login</button>
    </div>
  );
}

export default Login;
