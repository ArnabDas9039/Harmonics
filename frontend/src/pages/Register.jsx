import { useNavigate } from "react-router-dom";
import "../styles/Form.css";
import { useState } from "react";
import api from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/user/register/", {
        username,
        password,
      });
      if (response.status === 201) {
        alert("User created successfully");
      }
      navigate("/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Register</h1>
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
          Register
        </button>
      </form>
    </>
  );
}

export default Register;
