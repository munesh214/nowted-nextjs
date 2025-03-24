
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
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [folderName, setFolderName] = useState("Folder Notes");
    const [page, setPage] = useState(1);
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

    // Fetch notes when category changes
    const { data, isFetching } = useQuery({
        queryKey: ["notes", category], // Excluding `page` from queryKey
        queryFn: () => fetchNotesByCategory(1),
    });

    // Manage fetched data
    useEffect(() => {
        if (data) {
            if (data.length > 0) setFolderName(data[0].folder.name);
            setAllNotes(data);
            setPage(1); // Reset page when category changes
        }
    }, [data, category]);

    const loadMore = async () => {
        if (!isFetching) {
            const nextPage = page + 1;
            const newNotes = await fetchNotesByCategory(nextPage);
            if (newNotes.length > 0) {
                setAllNotes((prevNotes) => [...prevNotes, ...newNotes]);
                setPage(nextPage);
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
                {allNotes.map((note: Note) => (
                    <Card
                        key={note.id}
                        onClick={() => router.push(`/${category}/${note.id}`)}
                        sx={{
                            backgroundColor: "grey.800",
                            color: "white",
                            borderRadius: "0px",
                            boxShadow: "none",
                            "&:hover": { backgroundColor: "grey.700" },
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
                ))}

                {data && data.length === limit && (
                    <Button fullWidth variant="contained" onClick={loadMore} sx={{ mt: 2 }}>
                        {isFetching ? "Loading..." : "Load More"}
                    </Button>
                )}
            </Box>
        </Stack>
    );
};

export default NotesPanel;
