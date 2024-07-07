export const validateProfileForm = (formData) => {
  const errors = {};

  if (formData.username && formData.username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }

  if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email address is invalid";
  }

  return errors;
};
