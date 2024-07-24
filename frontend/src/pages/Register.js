import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const FormContainer = styled(Container)(({ theme }) => ({
  maxWidth: 400,
  margin: "auto",
  padding: theme.spacing(4),
  textAlign: "center",
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
}));

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  const { username, email, password, confirmPassword } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    if (success) navigate("/login");
  }, [success, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    dispatch(registerUser(formData));
  };

  return (
    <FormContainer>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          label="Confirm Password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </FormContainer>
  );
};
