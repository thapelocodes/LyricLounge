import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export const ProfileForm = ({
  formData,
  onChange,
  onSubmit,
  setIsEditing,
  errors,
  loading,
  hasChanges,
}) => {
  return (
    <StyledForm onSubmit={onSubmit}>
      <TextField
        name="username"
        label="Username"
        value={formData.username}
        onChange={onChange}
        variant="outlined"
      />
      {errors.username && (
        <Typography color="error">{errors.username}</Typography>
      )}
      <TextField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={onChange}
        variant="outlined"
      />
      {errors.email && <Typography color="error">{errors.email}</Typography>}
      <TextField
        name="profilePicture"
        label="Profile Picture URL"
        value={formData.profilePicture}
        onChange={onChange}
        variant="outlined"
      />
      {errors.profilePicture && (
        <Typography color="error">{errors.profilePicture}</Typography>
      )}
      <TextField
        name="bio"
        label="Bio"
        value={formData.bio}
        onChange={onChange}
        variant="outlined"
        multiline
        rows={4}
      />
      {errors.bio && <Typography color="error">{errors.bio}</Typography>}
      <Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!hasChanges() || loading}
        >
          Update Profile
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
      </Box>
    </StyledForm>
  );
};
