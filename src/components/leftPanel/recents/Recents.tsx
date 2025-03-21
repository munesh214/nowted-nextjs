import { Box, Stack, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { fetchRecentsNotes } from "@/services/notes.api";
import DescriptionIcon from "@mui/icons-material/Description";

const RecentNoteStyledButton = styled(Button)({
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    gap: "8px",
    color: "white",
    width: "100%",
    padding: "8px 16px",
    textTransform: "none",
    "&:hover": {
        borderRadius: "0",
        backgroundColor: "#333",
    },
});

const Recents = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["recentNotes"],
        queryFn: fetchRecentsNotes
    });

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error loading data</Typography>;

    return (
        <Stack gap={0.5}>
            <Typography color="white" variant="body2" fontWeight={600} px={2.5}>Recents</Typography>

            <Box>
                {data?.map((note) => (
                    <RecentNoteStyledButton key={note.id} onClick={() => console.log("Clicked:", note.id)}>
                        <DescriptionIcon />
                        <Typography variant="body2">{note.title}</Typography>
                    </RecentNoteStyledButton>
                ))}
            </Box>
        </Stack>
    );
};

export default Recents;
