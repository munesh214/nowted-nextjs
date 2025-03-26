import React, { useState, useEffect } from "react";
import { Box, Typography, Divider, Stack, FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import FolderIcon from "@mui/icons-material/Folder";
import { CreateAndUpdateNoteParams, Note } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFolders } from "@/services/folders.api";
import { updateNote } from "@/services/notes.api";
import { useParams, useRouter } from "next/navigation";

const NoteDetails = ({ noteData,
  noteTitle,
  noteContent}: { noteData: Note | undefined, noteTitle: string, noteContent: string}) => {
    const queryClient = useQueryClient();
    const { noteId,category } = useParams();
    const router = useRouter();
    const [selectedFolder, setSelectedFolder] = useState<string>("");

    // Set initial folderId only when noteData is available
    useEffect(() => {
        if (noteData) {
            setSelectedFolder(noteData.folder.id);
        }
    }, [noteData]);

    const { data: foldersList } = useQuery({
        queryKey: ["folders"],
        queryFn: fetchFolders,
    });

    const changeFolderMutation = useMutation({
        mutationFn: ({ noteId, noteDataPayload }: { noteId: string; noteDataPayload: CreateAndUpdateNoteParams }) =>
            updateNote(noteId, noteDataPayload),
        onSuccess: () => {
            alert("Note moved successfully!"); 
            queryClient.invalidateQueries({queryKey:["noteData",category, noteId]});
            if(category !== "archive")setTimeout(()=>router.push(`/${selectedFolder}/${noteId}`),200)
        }
    });

    const handleChange = (event: SelectChangeEvent<string>) => {
        if (!noteData) return; 

        const selectedValue = event.target.value;
        setSelectedFolder(selectedValue);

        const noteDataPayload: CreateAndUpdateNoteParams = {
            folderId: selectedValue,
            title: noteTitle,
            content: noteContent,
            isFavorite: noteData.isFavorite,
            isArchived: noteData.isArchived,
        };

        changeFolderMutation.mutate({ noteId: noteData.id, noteDataPayload });
    };

    return (
        <Box sx={{ color: "white" }}>
            {noteData ? (
                <>
                    <Stack direction="row" alignItems="center" spacing={7} mb={1.5}>
                        <Box display="flex" gap={2}>
                            <EventIcon sx={{ color: "gray" }} />
                            <Typography variant="body2" color="gray">Date</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                            {noteData.createdAt.slice(0, 10)}
                        </Typography>
                    </Stack>
                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
                    <Stack direction="row" alignItems="center" spacing={7} mt={1.5}>
                        <Box display="flex" gap={2}>
                            <FolderIcon sx={{ color: "gray" }} />
                            <Typography variant="body2" color="gray">Folder</Typography>
                        </Box>
                        <Box sx={{ minWidth: 100 }}>
                            <FormControl fullWidth>
                                <Select
                                    value={selectedFolder}
                                    onChange={handleChange}
                                    displayEmpty
                                    sx={{
                                        color: "white",
                                        padding: "0",
                                        outline: "none",
                                        border: "none",
                                        "& fieldset": { border: "none" },
                                        "&:hover": { backgroundColor: "#222" },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: "black",
                                                color: "white",
                                                maxHeight: 200,
                                                overflowY: "auto",
                                            },
                                        },
                                    }}
                                >
                                    {foldersList?.map((folder) => (
                                        <MenuItem key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>
                </>
            ) : (
                <Typography color="gray">No note selected</Typography>
            )}
        </Box>
    );
};

export default NoteDetails;
