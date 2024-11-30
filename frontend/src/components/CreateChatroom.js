import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChatroom } from "../features/chat/chatSlice";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: 350,
  margin: "auto",
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "15px",
  textAlign: "center",
  "&:hover": {
    boxShadow: `-1px -1px 6px ${theme.palette.primary.main}, 1px 1px 6px ${theme.palette.secondary.main}`,
  },
  width: "65%",
  minWidth: 250,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const FormContainer = styled(Container)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 25,
    height: 35,
    textAlign: "center",
  },
}));

const CreateChatroom = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.chat);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createChatroom({ name, description }));
  };

  return (
    <StyledContainer>
      <Typography variant={window.innerWidth < 1024 ? "h6" : "h5"} gutterBottom>
        Create a Chatroom
      </Typography>
      <FormContainer onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Name"
            variant="outlined"
            // fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="small"
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Description"
            variant="outlined"
            // fullWidth
            // multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            size="small"
          />
        </Box>
        <StyledButton
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </StyledButton>
        {error && <Typography color="error">{error}</Typography>}
      </FormContainer>
    </StyledContainer>
  );
};

export default CreateChatroom;
