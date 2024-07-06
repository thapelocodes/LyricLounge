import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

export const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { login, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
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
      <button type="submit" disabled={loading}>
        Login
      </button>
    </form>
  );
};
