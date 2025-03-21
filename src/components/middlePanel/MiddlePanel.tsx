import { Box } from "@mui/material"
import NotesPanel from "./notesPanel/NotesPanel"
import { useParams } from "next/navigation"

const MiddlePanel = () => {
    const {folderId} = useParams();
    console.log(folderId);


    return (
        <>
            <Box height="100%" width="27%" bgcolor="custom.contrastText">

                {folderId ? (<NotesPanel />): <p>please</p>}
                {/* <NotesPanel /> */}
            </Box>
        </>
    )
}

export default MiddlePanel