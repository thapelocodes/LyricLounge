import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { username, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    dispatch(registerUser(formData));
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="username"
        value={username}
        onChange={onChange}
        placeholder="Username"
        required
      />
      <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Email"
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
      <button type="submit" disabled={loading}>
        Register
      </button>
    </form>
  );
};
