import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const FormContainer = styled(Container)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  borderRadius: "12px",
  width: "65%",
  minWidth: 275,
  maxWidth: 400,
  margin: "auto",
  marginTop: theme.spacing(16),
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  "& .MuiOutlinedInput-root": {
    borderRadius: 25,
    height: 50,
  },
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
}));

export const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const { login, password } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/profile");
  }, [isAuthenticated, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <FormContainer>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          type="text"
          name="login"
          value={login}
          onChange={onChange}
          label="Email or Username"
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
        {error && <ErrorText>{error.message || error}</ErrorText>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </FormContainer>
  );
};
