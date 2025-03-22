import { Box } from "@mui/material"
import NotesPanel from "./notesPanel/NotesPanel"

const MiddlePanel = () => {

    return (
        <>
            <Box height="100%" width="27%" bgcolor="custom.contrastText">
                <NotesPanel />
            </Box>
        </>
    )
}

export default MiddlePanel