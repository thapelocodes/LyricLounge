import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChatroom } from "../features/chat/chatSlice";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
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
      <Typography variant="h4" gutterBottom>
        Create a Chatroom
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
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
      </form>
    </StyledContainer>
  );
};

export default CreateChatroom;
