import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const LoginContainer = styled(Container)(({ theme }) => ({
  height: "100%",
  // backgroundColor: theme.palette.background.default,
  marginTop: theme.spacing(12),
}));

const FormContainer = styled(Container)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  borderRadius: "12px",
  width:
    window.innerWidth < 640
      ? "100%"
      : window.innerWidth < 768
      ? "60%"
      : window.innerWidth < 1024
      ? "50%"
      : "40%",
  minWidth: 250,
  maxWidth: 350,
  padding: theme.spacing(4),
  textAlign: "center",
  backgroundColor: theme.palette.background.paper,
  "& .MuiOutlinedInput-root": {
    borderRadius: 25,
  },
  "&:hover": {
    boxShadow: "5px 5px 20px 5px rgba(20,4,40,0.2)",
  },
}));

const FormControl = styled("form")(({ theme }) => ({
  maxWidth: 300,
  margin: "auto",
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
  const [windowSize, setWindowSize] = useState();

  useEffect(() => {
    if (isAuthenticated) navigate("/chat");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (window !== undefined) {
      setWindowSize(window.innerWidth);

      const handleResize = () => {
        setWindowSize(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <LoginContainer>
      <FormContainer>
        <Typography variant={windowSize < 768 ? "h6" : "h5"} gutterBottom>
          Login to your account
        </Typography>
        <FormControl onSubmit={onSubmit}>
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
            size="small"
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
            size="small"
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
        </FormControl>
      </FormContainer>
    </LoginContainer>
  );
};
