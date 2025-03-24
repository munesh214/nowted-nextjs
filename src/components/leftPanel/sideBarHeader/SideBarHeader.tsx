// import { Box, Stack, IconButton, Button } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import { useParams, useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import { createNote } from "@/services/notes.api";



// const SideBarHeader = () => {

//     const router = useRouter();
//     const { category }: { category: string } = useParams();

//     // Mutation to create a new note
//     const createNoteMutation = useMutation({
//         mutationFn: (folderId: string) =>
//             createNote({
//                 folderId,
//                 title: "Untitled Note",
//                 content: "",
//                 isFavorite: false,
//                 isArchived: false,
//             }),
//         onSuccess: (data) => {
//             router.push(`/${category}/${data.id}`); // Navigate to the new note
//         },
//         onError: (error) => {
//             console.error("Failed to create note:", error);
//         },
//     });

//     const handleCreateNote = () => {
//         // Ensure category is a valid folder (not trash, favorite, or archive)
//         if (!category || ["trash", "favorite", "archive"].includes(category)) return;

//         createNoteMutation.mutate(category); // category is acting as folderId
//     };

//     return (
//         <>
//             <Stack direction="column" gap={1.5} width="100%" px={2.5} pt={2}>
//                 <Box display="flex" justifyContent="space-between">
//                     <Box component="img" src="/nowtedLogo.png" alt="Image description" />
//                     <IconButton>
//                         <SearchIcon sx={{ color: "white" }} />
//                     </IconButton>
//                 </Box>
//                 <Button variant="contained" onClick={handleCreateNote}>
//                     + New Note
//                 </Button>
//             </Stack>
//         </>
//     );
// };

// export default SideBarHeader;

import { useState, useEffect } from "react";
import { Box, Stack, IconButton, Button, TextField, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createNote, getNotes } from "@/services/notes.api";
import { FetchNotesParams, Note } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";

const SideBarHeader = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { category }: { category: string } = useParams();
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);

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
            queryClient.invalidateQueries({queryKey:["notes",category]});
            router.push(`/${category}/${data.id}`);
        },
        onError: (error) => {
            console.error("Failed to create note:", error);
        },
    });

    const handleCreateNote = () => {
        if (!category || ["trash", "favorite", "archive"].includes(category)) return;
        createNoteMutation.mutate(category);
    };

    const handleSearchToggle = () => {
        setIsSearchActive(!isSearchActive);
        setSearchTerm("");
        setSearchResults([]);
    };

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        
        setLoading(true);
        
        const searchTimeout = setTimeout(async () => {
            try {
                const params: FetchNotesParams = {
                    page: 1,
                    limit: 10,
                    search: searchTerm,
                };
                const results:Note[] = await getNotes(params);
                setSearchResults(results);
            } catch (error) {
                console.error("Search failed:", error);
            }
            setLoading(false);
        }, 1000);

        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);

    return (
        <Stack direction="column" gap={1.5} width="100%" px={2.5} pt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box component="img" src="/nowtedLogo.png" alt="Nowted Logo" height={40} />
                <IconButton onClick={handleSearchToggle}>
                    {isSearchActive ? <CloseIcon sx={{ color: "white" }} /> : <SearchIcon sx={{ color: "white" }} />}
                </IconButton>
            </Box>
            {isSearchActive ? (
                <TextField
                    variant="outlined"
                    placeholder="Search Notes"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{bgcolor:"white"}}
                />
            ) : (
                <Button variant="contained" color="secondary" onClick={handleCreateNote} sx={{padding:"14px"}}>
                    + New Note
                </Button>
            )}
            {isSearchActive && (
                <Box maxHeight={200} overflow="auto" bgcolor="white" borderRadius={1} p={1}>
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : searchResults.length === 0 ? (
                        <Box p={0.5} textAlign="center" color="gray">No notes found</Box>
                    ) : (
                        searchResults.map((note) => (
                            <Box
                                key={note.id}
                                p={1.5}
                                borderBottom="1px solid #ccc"
                                onClick={() => router.push(`/${note.folder.id}/${note.id}`)}
                                sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
                            >
                                {note.title}
                            </Box>
                        ))
                    )}
                </Box>
            )}
        </Stack>
    );
};

export default SideBarHeader;
