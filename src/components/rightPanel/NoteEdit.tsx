"use client";

import React, { useState } from "react";
import { Box, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Options from "./Options";
import NoteDetails from "./NoteDetails";

// Styled Title Field
const CustomTextField = styled(TextField)({
  width: "100%",
  "& .MuiInputBase-input": {
    color: "white",
    fontSize: "25px",
    fontWeight: 600,
  },
  backgroundColor: "transparent",
  "& .MuiInputBase-root": {
    backgroundColor: "transparent",
  },
  "& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottom: "none",
  },
});

// Styled Text Area
const CustomTextArea = styled(TextField)({
  width: "100%",
  flexGrow: 1, // Ensures it takes up remaining space
  display: "flex",
  
  "& .MuiInputBase-root": {
    backgroundColor: "transparent",
    display: "flex",
    flexGrow: 1,
    alignItems: "start"
  },

  "& .MuiInputBase-input": {
    color: "white",
    fontSize: "18px",
    fontWeight: 400,
    height: "100% !important", // Fills container
    
    maxHeight: "100%", // Prevents content overflow
    // scrollbarWidth: "thin", // Firefox scrollbar styling
  },

  "& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottom: "none",
  },
});

const NoteEdit = () => {
  // State for the title field
  const [inputValue, setInputValue] = useState("Small");

  // Handler for input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    console.log("Input value:", event.target.value);
  };

  return (
    <Stack padding={3.5} width="48%" height="100vh" gap="20px">
      {/* Title + Options (natural height) */}
      <Box width="100%" display="flex">
        <CustomTextField
          value={inputValue}
          onChange={handleInputChange}
          variant="standard"
          size="small"
        />
        <Options />
      </Box>

      {/* Note Details (natural height) */}
      <NoteDetails />

      {/* Expandable Text Area */}
      <Box flexGrow={1} width="100%" display="flex">
        <CustomTextArea variant="standard" size="small" multiline />
      </Box>
    </Stack>
  );
};

export default NoteEdit;
