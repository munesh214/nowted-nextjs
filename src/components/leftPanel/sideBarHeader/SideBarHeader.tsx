import { Box, Stack,IconButton,Button } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';


const SideBarHeader = () => {
    return (
        <>
            <Stack direction="column" gap={1.5} width="100%"  px={2.5} pt={2}>
                <Box display="flex" justifyContent="space-between">
                    <Box component="img" src="/nowtedLogo.png" alt="Image description" />
                    <IconButton>
                        <SearchIcon sx={{color:"white"}}/>
                    </IconButton>
                </Box>
                <Button variant="contained">+ New Note</Button>
            </Stack>
        </>
    )
}

export default SideBarHeader