"use client";

import React, { useState } from 'react';
import { Box, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Options from './Options';
import NoteDetails from './NoteDetails';

// Define the styled TextField component
const CustomTextField = styled(TextField)({
  width: '100%',
  '& .MuiInputBase-input': {
    color: 'white',
    fontSize: '25px',
    fontWeight: 600,
  },
  backgroundColor: 'transparent',
  '& .MuiInputBase-root': {
    backgroundColor: 'transparent',
  },
  '& .MuiInput-underline:before': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottom: 'none',
  },
});

const NoteEdit = () => {
  // State to manage the input value
  const [inputValue, setInputValue] = useState('Small');

  // Handler for input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    console.log("Input value:", event.target.value);
  };

  return (
    <Stack padding={3.5} width="48%" gap="20px">
      <Box width="100%" display="flex">
        <CustomTextField
          value={inputValue} // Controlled component value
          onChange={handleInputChange} // Event handler
          variant="standard"
          size="small"
        />
        <Options />
      </Box>

      <NoteDetails />
    </Stack>
  );
};

export default NoteEdit;
