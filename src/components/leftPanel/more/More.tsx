"use client"
import { Box, Button, Stack, styled, Typography } from "@mui/material"
import StarBorderIcon from '@mui/icons-material/StarBorder';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useRouter } from "next/navigation";


const RecentNoteStyledButton = styled(Button)({
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    gap: "8px",
    borderRadius: "none",
    color: "white",
    width: "100%",
    padding: "8px 16px",
    textTransform: "none",
    "&:hover": {
        borderRadius: "0",
        backgroundColor: "#333",
    },
});


const More = () => {
    const route = useRouter();
    return (
        <>
            <Stack gap={0.5}>
                <Typography color="white" variant="body2" fontWeight={600} px={2.5}>More</Typography>

                <Box>
                    <RecentNoteStyledButton onClick={() => route.push("/favorite")}>
                        <StarBorderIcon />
                        <Typography variant="body2">Favorite</Typography>
                    </RecentNoteStyledButton>
                    <RecentNoteStyledButton onClick={() => route.push("/trash")}>
                        <DeleteOutlineIcon />
                        <Typography variant="body2">Trash</Typography>
                    </RecentNoteStyledButton>
                    <RecentNoteStyledButton onClick={() => route.push("/archive")}>
                        <InventoryIcon sx={{fontSize:"19px"}} />
                        <Typography variant="body2">Archive</Typography>
                    </RecentNoteStyledButton>
                    
                </Box>
            </Stack>
        </>
    )
}

export default More