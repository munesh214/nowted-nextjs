"use client"
import { Box, Typography } from "@mui/material"
import NotesPanel from "./notesPanel/NotesPanel"
import { useParams } from "next/navigation"

const MiddlePanel = () => {
    const { category } = useParams();
    return (
        <>
            <Box height="100%" width="27%" bgcolor="custom.contrastText">
                {
                    !category
                        ? <Typography padding={5} variant="h5" color="white">No folder Selected!</Typography>
                        : <NotesPanel />
                }
            </Box>
        </>
    )
}

export default MiddlePanel