"use client";

import { useState, useEffect, useRef} from "react";
import { Box, Input, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Options from "./Options";
import NoteDetails from "./NoteDetails";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getNoteById, updateNote } from "@/services/notes.api";
import { useQueryClient } from "@tanstack/react-query";
import Restore from "./Restore";

// Styled TitleField
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

// Styled Input
const CustomTextArea = styled(Input)({
  "& .MuiInputBase-input": {
    color: "white",
    fontSize: "18px",
    fontWeight: 400,
    height: "100% !important",
    overflow: "auto",
  },
  "& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before": {
  },
});

const NoteEdit = () => {
  const queryClient = useQueryClient();
  const { noteId,category }: { noteId: string , category:string} = useParams();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch note data
  const { data: noteData, isPending } = useQuery({
    queryKey: ["noteData",category, noteId],
    queryFn: () => getNoteById(noteId),
  });

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isDeleted, setIsDeleted] = useState<boolean>(false)

  // Sync state when data is fetched
  useEffect(() => {
    if (noteData) {
      setNoteTitle(noteData.title || "");
      setNoteContent(noteData.content || "");
      setIsDeleted(noteData.deletedAt !== null)
    }
  }, [noteData]);

  if (isPending) return <p>Loading...</p>;
  if(isDeleted) return <Restore setIsDeleted={setIsDeleted} /> 

  // 🔹 Debounced update function
  const handleUpdate = (updatedTitle: string, updatedContent: string) => {
    setNoteTitle(updatedTitle);
    setNoteContent(updatedContent);

    // Clear existing timer
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // Set new timer
    debounceTimer.current = setTimeout(async () => {
      if (!noteData) return;

      const updatedNote = {
        ...noteData,
        title: updatedTitle,
        content: updatedContent,
      };

      await updateNote(noteId, updatedNote); // Make API call to update the note
      queryClient.invalidateQueries({queryKey:["notes", category] });
    }, 1500);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdate(event.target.value, noteContent);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdate(noteTitle, event.target.value);
  };

  return (
    <Stack padding={3.5} width="48%" height="100vh" gap="30px">
      <Box width="100%" display="flex">
        <CustomTextField
          value={noteTitle}
          onChange={handleTitleChange}
          color="secondary"
          variant="standard"
          size="small"
        />
        <Options noteData={noteData} noteTitle={noteTitle} noteContent={noteContent} changeDlt={setIsDeleted} />
      </Box>

      <NoteDetails noteData={noteData} noteTitle={noteTitle} noteContent={noteContent} />

      <Box flexGrow={1} width="100%" display="flex">
        <CustomTextArea
          multiline
          defaultValue={noteContent}
          rows={1}
          onChange={handleContentChange}
          disableUnderline
          fullWidth
        />
      </Box>
    </Stack>  
  );
};

export default NoteEdit;
