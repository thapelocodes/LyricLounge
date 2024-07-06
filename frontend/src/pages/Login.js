import React, { useState } from "react";
import axios from "axios";

export const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [error, setError] = useState("");
  const { login, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/login", formData);
      console.log(res.data);
    } catch (err) {
      setError(err.response.data.message || "An error occurred");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="login"
        value={login}
        onChange={onChange}
        placeholder="Email or Username"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Password"
        required
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};
