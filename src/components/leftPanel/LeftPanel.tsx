import { Box } from "@mui/material"

import SideBarHeader from "./sideBarHeader/SideBarHeader"
import Recents from "./recents/Recents"

const LeftPanel = () => {
    return (
        <>
            <Box height="100%" width="25%" display="flex" flexDirection="column" gap={2} sx={{bgcolor:"#0a0a0a"}}>
                <SideBarHeader />
                <Recents />
            </Box>
        </>
    )
}

export default LeftPanel