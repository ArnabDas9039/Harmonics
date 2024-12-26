import { useContext, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN, USERNAME } from "../constants";
import "../styles/Form.css";
import AuthContext from "../contexts/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthorized, setIsAuthorized, user, setUser } =
    useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/token/", { username, password });

      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      localStorage.setItem(USERNAME, username);
      setIsAuthorized(true);
      setUser(username);

      history.back();
    } catch (error) {
      alert("Invalid username or password");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Login</h1>
        <input
          type="text"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="form-button" type="submit">
          Login
        </button>
      </form>
    </>
  );
}

export default Login;
