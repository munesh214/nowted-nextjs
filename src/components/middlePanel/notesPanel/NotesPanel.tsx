"use client";
import { useState, useEffect } from "react";
import { Box, Stack, Typography, Card, CardActionArea, CardContent, Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "@/services/notes.api";
import { FetchNotesParams, Note } from "@/types/types";

const NotesPanel = () => {
    const router = useRouter();
    const { category }: { category: string } = useParams();
    const [page, setPage] = useState(1);
    const [allNotes, setAllNotes] = useState<Note[]>([]); // Store all notes
    const limit = 10;

    // Function to fetch notes
    const fetchNotesByCategory = async (pageParam: number) => {
        const params: FetchNotesParams = { page: pageParam, limit };
        if (category === "favorite") params.favorite = true;
        else if (category === "archive") params.archived = true;
        else if (category === "trash") params.deleted = true;
        else params.folderId = category;
        return getNotes(params);
    };

    // Fetch notes when category or page changes
    const { data, isFetching } = useQuery({
        queryKey: ["notes", category, page],
        queryFn: () => fetchNotesByCategory(page),
    });

    // Update allNotes state when new data is fetched
    useEffect(() => {
        if (data) {
            setAllNotes((prevNotes) => [...prevNotes, ...data]); // Append new notes
        }
    }, [data]);

    const loadMore = () => {
        if (!isFetching && data?.length === limit) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <Stack height="100vh" sx={{ overflow: "auto" }} padding="20px" gap={1.5}>
            <Typography variant="h6" fontWeight={600} pt="10px" color="white">
                {category === "favorite"
                    ? "Favorite Notes"
                    : category === "archive"
                        ? "Archived Notes"
                        : category === "trash"
                            ? "Trash"
                            : "Folder Notes"}
            </Typography>

            <Box sx={{ overflow: "auto" }}>
                {allNotes.map((note: Note, index: number) => (
                    <Card
                        key={index}
                        onClick={() => router.push(`/${category}/${note.id}`)}
                        sx={{
                            backgroundColor: "grey.800",
                            color: "white",
                            borderRadius: "0px",
                            boxShadow: "none",
                            "&:hover": { backgroundColor: "grey.700" },
                            mb: 1,
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
                ))}

                <Button
                    fullWidth
                    variant="contained"
                    onClick={loadMore}
                    style={{ display: data && data.length === limit ? "block" : "none" }}
                    sx={{ mt: 2 }}
                >
                    {isFetching ? "Loading..." : "Load More"}
                </Button>
            </Box>

        </Stack>
    );
};

export default NotesPanel;

