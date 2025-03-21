import { Box, Typography } from "@mui/material"

const Restore = () => {
    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center" width="48%" height="100%">
                <Box padding={10} gap={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Box component="img" src="/restore.png" alt="Restore Icon" />
                    <Typography
                        fontWeight={600}
                        align="center"
                        fontSize="25px"
                        variant="h5"
                        color="White"
                    >Restore “Reflection on”
                    </Typography>
                    <Typography
                        variant="body1"
                        color="rgba(255, 255, 255, 0.6);"
                        align="center"
                    >{`Don't want to lose this note? It's not too late! Just click the 'Restore' button and it will be added back to your list. It's that simple.`}
                    </Typography>
                </Box>
            </Box>
        </>
    )
}

export default Restore