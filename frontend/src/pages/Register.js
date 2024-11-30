import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const FormContainer = styled(Container)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  borderRadius: "12px",
  width:
    window.innerWidth < 640
      ? "100%"
      : window.innerWidth < 768
      ? "60%"
      : window.innerWidth < 1024
      ? "40%"
      : "25%",
  minWidth: 250,
  maxWidth: 350,
  marginTop: theme.spacing(12),
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  textAlign: "center",
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  // "& .MuiOutlinedInput-root": {
  //   height: 35,
  //   textAlign: "center",
  // },
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
  const [windowSize, setWindowSize] = useState();

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  const { username, email, password, confirmPassword } = formData;
  const navigate = useNavigate();

  useEffect(() => {
    if (success) navigate("/login");
  }, [success, navigate]);

  useEffect(() => {
    if (window !== undefined) {
      setWindowSize(window.innerWidth);
      const handleResize = () => {
        setWindowSize(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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
      <Typography variant={windowSize < 768 ? "h6" : "h5"} gutterBottom>
        Register
      </Typography>
      <FormControl onSubmit={onSubmit}>
        <StyledTextField
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          size="small"
        />
        <StyledTextField
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          size="small"
        />
        <StyledTextField
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
        <StyledTextField
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          label="Confirm Password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          size="small"
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
      </FormControl>
    </FormContainer>
  );
};
