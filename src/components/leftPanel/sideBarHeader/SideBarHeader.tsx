import { Box, Stack, IconButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createNote } from "@/services/notes.api";
import { useContext } from "react";
import { RefetchNotesContext } from "@/context/RefetchNotesContext";

const SideBarHeader = () => {
    const context = useContext(RefetchNotesContext);

    const router = useRouter();
    const { category }: { category: string } = useParams();

    // Mutation to create a new note
    const createNoteMutation = useMutation({
        mutationFn: (folderId: string) =>
            createNote({
                folderId,
                title: "Untitled Note",
                content: "",
                isFavorite: false,
                isArchived: false,
            }),
        onSuccess: (data) => {
            context!.setTrigger!(p=>!p)
            router.push(`/${category}/${data.id}`); // Navigate to the new note
        },
        onError: (error) => {
            console.error("Failed to create note:", error);
        },
    });

    const handleCreateNote = () => {
        // Ensure category is a valid folder (not trash, favorite, or archive)
        if (!category || ["trash", "favorite", "archive"].includes(category)) return;

        createNoteMutation.mutate(category); // category is acting as folderId
    };

    return (
        <>
            <Stack direction="column" gap={1.5} width="100%" px={2.5} pt={2}>
                <Box display="flex" justifyContent="space-between">
                    <Box component="img" src="/nowtedLogo.png" alt="Image description" />
                    <IconButton>
                        <SearchIcon sx={{ color: "white" }} />
                    </IconButton>
                </Box>
                <Button variant="contained" onClick={handleCreateNote}>
                    + New Note
                </Button>
            </Stack>
        </>
    );
};

export default SideBarHeader;
