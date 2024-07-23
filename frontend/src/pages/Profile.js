import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  updateProfile,
  setProfile,
} from "../features/profile/profileSlice";
import { ProfileForm } from "../components/ProfileForm";
import { validateProfileForm } from "../utils/validation";

export const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.profile.profile);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePicture: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile()).then((response) => {
        if (response.payload) {
          dispatch(setProfile(response.payload));
        }
      });
    } else {
      setFormData({
        username: profile.username,
        email: profile.email,
        profilePicture: profile.profilePicture || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const hasChanges = () => {
    return (
      formData.username !== user.username ||
      formData.email !== user.email ||
      formData.profilePicture !== user.profilePicture ||
      formData.bio !== user.bio
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProfileForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    dispatch(updateProfile(formData)).then((response) => {
      if (!response.error) {
        setIsEditing(false);
        dispatch(fetchProfile()).then((response) => {
          if (response.payload) {
            dispatch(setProfile(response.payload));
          }
        });
      }
    });
  };

  return (
    <div>
      <h2>Profile</h2>
      {loading && <p>Loading...</p>}
      {!loading && profile && (
        <>
          {!isEditing ? (
            <div>
              <p>Username: {user && user.username}</p>
              <p>Email: {user && user.email}</p>
              <p>
                Profile Picture:{" "}
                {user && user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" width="100px" />
                ) : (
                  <img
                    src={require("../assets/profile-user_64572.png")}
                    alt="Profile"
                    width="100px"
                  />
                )}
              </p>
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
        </>
      )}
    </div>
  );
};
