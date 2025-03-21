import { Box, Stack, Typography, Card, CardActionArea, CardContent } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "@/services/notes.api";

// import { use } from "react";

const NotesPanel = () => {
    const route = useRouter()
    const { folderId }: { folderId: string } = useParams();
    console.log(folderId);

    const { data, isPending } = useQuery({
        queryKey: ["notes", folderId],
        queryFn: () => getNotes({ page: 1, limit: 10, folderId: folderId }),
            });

    if (isPending) return <p>Loading...</p>;

    return (
        <Stack height="100vh" sx={{ overflow: "auto" }} padding="20px" gap={1.5}>
            <Typography variant="h6" fontWeight={600} pt="10px" color="white">
                Folder Name
            </Typography>

            <Box sx={{ overflow: "auto" }}>
                {data?.map((note) => (
                    <Card
                        key={note.id}
                        onClick={()=> route.push(`/${folderId}/8724297-sdfjs83`)}
                        sx={{
                            backgroundColor: "grey.800",
                            color: "white",
                            borderRadius: "0px",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "grey.700",
                            },
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
            </Box>
        </Stack>
    );
};

export default NotesPanel;
