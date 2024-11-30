import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../features/auth/authSlice";
import { setProfile } from "../features/profile/profileSlice";
import { ProfileForm } from "../components/ProfileForm";
import { validateProfileForm } from "../utils/validation";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
  marginTop: theme.spacing(6),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  // maxWidth: 600,
  margin: "auto",
  padding: theme.spacing(1),
  // marginBottom: theme.spacing(2),
  boxShadow: "none",
  borderRadius: 0,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: window.innerWidth < 768 ? 75 : 100,
  height: window.innerWidth < 768 ? 75 : 100,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const StyledCover = styled("div")(({ theme }) => ({
  height: window.innerWidth < 768 ? 100 : 300,
  backgroundImage: `url(${require("../assets/profile-user_64572.png")})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
}));

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
  const [file, setFile] = useState(null);

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

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const hasChanges = () => {
    return (
      formData.username !== user.username ||
      formData.email !== user.email ||
      formData.profilePicture !== user.profilePicture ||
      formData.bio !== user.bio ||
      file
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

    console.log("file value:", file);
    const updatedData = new FormData();
    updatedData.append("username", formData.username);
    updatedData.append("email", formData.email);
    updatedData.append("bio", formData.bio);
    if (file) updatedData.append("profilePicture", file);

    for (let [key, value] of updatedData.entries()) {
      console.log(`${key}:`, value);
    }

    dispatch(updateProfile(updatedData)).then((response) => {
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
    <StyledContainer>
      {loading && <Typography>Loading...</Typography>}
      {!loading && profile && (
        <div>
          {!isEditing ? (
            <>
              <Box alignItems="center" mb={2}>
                <StyledCover>
                  <StyledAvatar
                    src={
                      profile && profile.profilePicture
                        ? `http://localhost:5000/${profile.profilePicture.replace(
                            /^.*\/uploads\//,
                            "uploads/"
                          )}`
                        : require("../assets/profile-user_64572.png")
                    }
                    alt="Profile"
                  />
                </StyledCover>
                <Box ml={2}>
                  <Typography variant="h6">{user && user.username}</Typography>
                  <Typography variant="body1">{user && user.email}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user && user.bio}
                  </Typography>
                </Box>
              </Box>
              {user && (
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </StyledButton>
              )}
            </>
          ) : (
            <ProfileForm
              formData={formData}
              onChange={onChange}
              onSubmit={onSubmit}
              setIsEditing={setIsEditing}
              errors={errors}
              loading={loading}
              hasChanges={hasChanges}
              onFileChange={onFileChange}
            />
          )}
        </div>
      )}
    </StyledContainer>
  );
};
