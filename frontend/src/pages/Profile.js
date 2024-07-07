import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { updateProfile } from "../features/auth/authSlice";

export const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePicture: "",
    bio: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/profile");
        setFormData({
          username: data.username,
          email: data.email,
          profilePicture: data.profilePicture || "",
          bio: data.bio || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

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
      <button type="submit">Update Profile</button>
    </form>
  );
};
