import React from "react";
import { Box, Typography, Divider, Stack } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import FolderIcon from "@mui/icons-material/Folder";

const NoteDetails = () => {
    return (
        <Box sx={{ color: "white" }}>
            <Stack direction="row" alignItems="center" spacing={7} mb={1.5}>
                <Box display="flex" gap={2} >
                    <EventIcon sx={{ color: "gray" }} />
                    <Typography variant="body2" color="gray">
                        Date
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>21/06/2022</Typography>
            </Stack>
            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
            <Stack direction="row" alignItems="center" spacing={7} mt={1.5}>
                <Box display="flex" gap={2} >
                    <FolderIcon sx={{ color: "gray" }} />
                    <Typography variant="body2" color="gray">
                        Folder
                    </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>Personal</Typography>
            </Stack>
        </Box>
    );
};

export default NoteDetails;
