import React from "react";

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
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={onChange}
        placeholder="Username"
      />
      {errors.username && <p>{errors.username}</p>}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email}</p>}
      <input
        type="text"
        name="profilePicture"
        value={formData.profilePicture}
        onChange={onChange}
        placeholder="Profile Picture URL"
      />
      {errors.profilePicture && <p>{errors.profilePicture}</p>}
      <textarea
        name="bio"
        value={formData.bio}
        onChange={onChange}
        placeholder="Bio"
      />
      {errors.bio && <p>{errors.bio}</p>}
      <button type="submit" disabled={!hasChanges() || loading}>
        Update Profile
      </button>
      <button type="button" onClick={() => setIsEditing(false)}>
        Cancel
      </button>
    </form>
  );
};
