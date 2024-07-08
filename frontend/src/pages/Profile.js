import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../features/auth/authSlice";
import { ProfileForm } from "../components/ProfileForm";
import { validateProfileForm } from "../utils/validation";

export const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePicture: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
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
    const validationErrors = validateProfileForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
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
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Profile Picture: {user.profilePicture}</p>
          <p>Bio: {user.bio}</p>
          {user && (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      ) : (
        <ProfileForm
          user={user}
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          setIsEditing={setIsEditing}
          errors={errors}
          loading={loading}
        />
      )}
    </div>
  );
};
