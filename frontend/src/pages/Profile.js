import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../features/auth/authSlice";
import { setProfile } from "../features/profile/profileSlice";
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
    dispatch(fetchProfile()).then((action) => {
      if (fetchProfile.fulfilled.match(action)) {
        dispatch(setProfile(action.payload));
      }
    });
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
      dispatch(updateProfile(changes)).then((action) => {
        if (updateProfile.fulfilled.match(action)) {
          dispatch(setProfile(action.payload));
        }
      });
    }
    setIsEditing(false);
  };

  const hasChanges = () => {
    return (
      formData.username !== user.username ||
      formData.email !== user.email ||
      formData.profilePicture !== user.profilePicture ||
      formData.bio !== user.bio
    );
  };

  return (
    <div>
      <h2>Profile</h2>
      {!isEditing ? (
        <div>
          <p>Username: {user && user.username}</p>
          <p>Email: {user && user.email}</p>
          <p>Profile Picture: {user && user.profilePicture}</p>
          <p>Bio: {user && user.bio}</p>
          {user && (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      ) : (
        <ProfileForm
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          setIsEditing={setIsEditing}
          errors={errors}
          loading={loading}
          hasChanges={hasChanges}
        />
      )}
    </div>
  );
};
