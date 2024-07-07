import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../features/auth/authSlice";

export const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePicture: "",
    bio: "",
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        profilePicture: user.profilePicture || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={onChange}
        placeholder="Username"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Email"
        required
      />
      <input
        type="text"
        name="profilePicture"
        value={formData.profilePicture}
        onChange={onChange}
        placeholder="Profile Picture URL"
      />
      <textarea
        name="bio"
        value={formData.bio}
        onChange={onChange}
        placeholder="Bio"
      />
      {error && <p>{error}</p>}
      <button type="submit" disabled={loading}>
        Update Profile
      </button>
    </form>
  );
};
