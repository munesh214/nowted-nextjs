"use client";
import { useState, useEffect } from "react";
import { Box, Stack, Typography, Card, CardActionArea, CardContent, Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "@/services/notes.api";
import { FetchNotesParams, Note } from "@/types/types";

const NotesPanel = () => {
    const router = useRouter();
    const { category, noteId }: { category: string; noteId?: string } = useParams();
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [folderName, setFolderName] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore,setHasMore] = useState(true);

    // Function to fetch notes
    const fetchNotesByCategory = async (pageParam: number) => {
        const params: FetchNotesParams = { page: pageParam, limit:10 };
        if (category === "favorite"){
            params.favorite = true ;
            params.archived = false;
            params.deleted = false;
        } 
        else if (category === "archive"){
            params.archived = true;
            params.deleted = false;
        } 
        else if (category === "trash")params.deleted = true;
        else {
            params.folderId = category ;
            params.archived = false;
            params.deleted = false;
        }
        return getNotes(params);
    };

    // Fetch notes when category changes
    const { data, isFetching } = useQuery({
        queryKey: ["notes", category],
        queryFn: () => fetchNotesByCategory(1),
    });

    // Manage fetched data
    useEffect(() => {
        if (data) {
            if(data.length == 0) setFolderName("No Notes in this folder!");
            if (data.length > 0) setFolderName(data[0].folder.name);
            setHasMore(true)
            setAllNotes(data);
            setPage(1);
        }
    }, [data, category]);

    const loadMore = async () => {
        if (!isFetching) {
            const newNotes = await fetchNotesByCategory(page+1);
            if(newNotes.length < 10) setHasMore(p=>!p);
            if (newNotes.length > 0) {
                setAllNotes((prevNotes) => [...prevNotes, ...newNotes]);
                setPage(page+1);
            }
        }
    };

    return (
        <Stack height="100vh" sx={{ overflow: "auto" }} padding="20px" gap={3}>
            <Typography variant="h4" fontWeight={600} pt="10px" color="white">
                {category === "favorite"
                    ? "Favorite Notes"
                    : category === "archive"
                    ? "Archived Notes"
                    : category === "trash"
                    ? "Trash"
                    : folderName}
            </Typography>

            <Box sx={{ overflow: "auto" }}>
                {allNotes.map((note: Note) => {
                    const isSelected = note.id === noteId; // Check if note is selected

                    return (
                        <Card
                            key={note.id}
                            onClick={() => router.push(`/${category}/${note.id}`)}
                            sx={{
                                backgroundColor: isSelected ? "purple" : "grey.800", // Change background if selected
                                color: "white",
                                borderRadius: "0px",
                                boxShadow: "none",
                                "&:hover": { backgroundColor: isSelected ? "purple" : "grey.700" },
                                mb: 2,
                            }}
                        >
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                        {note.title}
                                    </Typography>

                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="grey.500">
                                            {new Date(note.updatedAt).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" color="grey.400" noWrap>
                                            {`${note.preview?.slice(0, 25)}...`}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    );
                })}

                {data && data.length === 10 && hasMore && (
                    <Button color="secondary" fullWidth variant="contained" onClick={loadMore} sx={{ mt: 2 }}>
                        {isFetching ? "Loading..." : "Load More"}
                    </Button>
                )}
            </Box>
        </Stack>
    );
};

export default NotesPanel;
