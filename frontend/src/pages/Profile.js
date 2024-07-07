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
  const [isEditing, setIsEditing] = useState(false);

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
    const changes = {};
    if (formData.username !== user.username)
      changes.username = formData.username;
    if (formData.email !== user.email) changes.email = formData.email;
    if (formData.profilePicture !== user.profilePicture)
      changes.profilePicture = formData.profilePicture;
    if (formData.bio !== user.bio) changes.bio = formData.bio;
    if (Object.keys(changes).length > 0) {
      dispatch(updateProfile(changes));
    }
    setIsEditing(false);
  };

  return (
    <div>
      <h2>Profile</h2>
      {!isEditing ? (
        <div>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
          <p>Profile Picture: {user?.profilePicture}</p>
          <p>Bio: {user?.bio}</p>
          {user && (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Email"
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
          <button
            type="submit"
            disabled={
              loading ||
              (formData.username === user.username &&
                formData.email === user.email &&
                formData.profilePicture === user.profilePicture &&
                formData.bio === user.bio)
            }
          >
            Update Profile
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};
