"use client"
import MiddlePanel from "@/components/middlePanel/MiddlePanel"
import NoNoteSelected from "@/components/rightPanel/NoNoteSelected"
// import { Box } from "@mui/material"
const page = () => {
    return (
        <>
            {/* <Box width={} bgcolor="custom.main"> */}
                <MiddlePanel />
                <NoNoteSelected />
            {/* </Box> */}
        </>
    )
}

export default page