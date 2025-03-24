"use client";

import { useState, useEffect, useRef,useContext } from "react";
import { Box, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Options from "./Options";
import NoteDetails from "./NoteDetails";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getNoteById, updateNote } from "@/services/notes.api"; // Ensure you have an API function to update the note
import { RefetchNotesContext } from "@/context/RefetchNotesContext";
import Restore from "./Restore";
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
  flexGrow: 1,
  display: "flex",
  overflow: "hidden",
  "& .MuiInputBase-root": {
    backgroundColor: "transparent",
    display: "flex",
    flexGrow: 1,
    alignItems: "start",
    overflow: "auto",
  },
  "& .MuiInputBase-input": {
    color: "white",
    fontSize: "18px",
    fontWeight: 400,
    height: "100% !important",
    maxHeight: "100%",
    overflow: "auto",
  },
  "& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before": {
    borderBottom: "none",
  },
});

const NoteEdit = () => {
  const context = useContext(RefetchNotesContext);
  const { noteId,category }: { noteId: string , category:string} = useParams();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch note data
  const { data: noteData, isPending } = useQuery({
    queryKey: ["noteData", category,noteId],
    queryFn: () => getNoteById(noteId),
  });

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isDeleted, setIsDeleted] = useState<boolean>(noteData?.deletedAt === null)

  // Sync state when data is fetched
  useEffect(() => {
    if (noteData) {
      setNoteTitle(noteData.title || "");
      setNoteContent(noteData.content || "");
    }
  }, [noteData]);

  if (isPending) return <p>Loading...</p>;
  if(isDeleted) return <Restore /> 

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
      context!.setTrigger!((p:boolean)=>!p);
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
          variant="standard"
          size="small"
        />
        <Options noteData={noteData} noteTitle={noteTitle} noteContent={noteContent} changeDlt={setIsDeleted} />
      </Box>

      <NoteDetails noteData={noteData} />

      <Box flexGrow={1} width="100%" display="flex">
        <CustomTextArea
          variant="standard"
          size="small"
          multiline
          value={noteContent}
          onChange={handleContentChange}
        />
      </Box>
    </Stack>
  );
};

export default NoteEdit;
