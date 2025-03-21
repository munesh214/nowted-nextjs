import { Box, Typography } from "@mui/material"



const NoNoteSelected = () => {
    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center" width="48%" height="100%">
                <Box padding={16} gap={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Box component="img" src="/file.png" alt="File Icon" />
                    <Typography
                        fontWeight={600}
                        fontSize="28px"
                        variant="h5"
                        color="White"
                    >Select a note to view
                    </Typography>
                    <Typography
                        variant="body1"
                        color="rgba(255, 255, 255, 0.6);"
                        align="center"
                    >Choose a note from the list on the left to view its contents, or create a new note to add to your collection.
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default NoNoteSelected