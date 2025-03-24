// import { getNoteById } from "@/services/notes.api";
import { Box, Button, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation"
import { getNoteById } from "@/services/notes.api";

const Restore = () => {
    const {noteId}:{noteId:string} = useParams();

    const {data,isPending} = useQuery({
        queryKey:["restore"],
        queryFn:()=> getNoteById(noteId)
    })

    if(isPending) return <p>Loading...</p>
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
                    >{`Restore "${data?.title}"`}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="rgba(255, 255, 255, 0.6);"
                        align="center"
                    >{`Don't want to lose this note? It's not too late! Just click the 'Restore' button and it will be added back to your list. It's that simple.`}
                    </Typography>
                    <Button variant="contained" color="secondary">Restore</Button>
                </Box>
            </Box>
        </>
    )
}

export default Restore