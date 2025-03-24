import { Box, Button, Typography } from "@mui/material";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getNoteById, restoreNote } from "@/services/notes.api";


const Restore = ({setIsDeleted}:{setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const { noteId }: { noteId: string } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();



    // Fetch note details
    const { data: noteData, isPending } = useQuery({
        queryKey: ["restore", noteId],
        queryFn: () => getNoteById(noteId),
    });

    // Restore note mutation
    const restoreMutation = useMutation({
        mutationFn: () => restoreNote(noteId),
        onSuccess: () => {
            alert("Note Restored Successfully!");
            if(setIsDeleted) setIsDeleted((p:boolean) =>!p);
            // Invalidate cache so the UI updates
            // queryClient.invalidateQueries({queryKey: ["noteData",noteId]});
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
            

            // Navigate to the restored note's folder
            if (noteData) {
                router.push(`/${noteData.folderId}/${noteData.id}`);
            }
        },
    });

    if (isPending) return <p>Loading...</p>;

    return (
        <Box display="flex" justifyContent="center" alignItems="center" width="48%" height="100%">
            <Box padding={10} gap={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Box component="img" src="/restore.png" alt="Restore Icon" />
                <Typography fontWeight={600} align="center" fontSize="25px" variant="h5" color="White">
                    {`Restore "${noteData?.title}"`}
                </Typography>
                <Typography variant="body1" color="rgba(255, 255, 255, 0.6);" align="center">
                    {`Don't want to lose this note? It's not too late! Just click the 'Restore' button and it will be added back to your list. It's that simple.`}
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => restoreMutation.mutate()} disabled={restoreMutation.isPending}>
                    {restoreMutation.isPending ? "Restoring..." : "Restore"}
                </Button>
            </Box>
        </Box>
    );
};

export default Restore;
