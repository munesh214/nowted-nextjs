import { Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery } from "@tanstack/react-query";
import { fetchFolders } from "@/services/folders.api";
import { useRouter } from "next/navigation";

const Folders = () => {
    const route = useRouter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["folders"],
        queryFn: fetchFolders
    });

    if (isLoading) return <Typography color="white">Loading...</Typography>;
    if (isError) return <Typography color="red">Error loading folders</Typography>;

    return (
        <Stack color="white" height="100%">
            {/* Header stays fixed */}
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2.5}>
                <Typography color="inherit" variant="body2" fontWeight={600}>
                    Folders
                </Typography>

                <IconButton size="medium" color="inherit"> {/* Inherit white color */}
                    <CreateNewFolderOutlinedIcon color="inherit" />
                </IconButton>
            </Box>

            {/* Scrollable List */}
            <Box flex={1} overflow="auto">  
            <List disablePadding>
  {data?.map((folder: { id: string, name: string }) => (
    <ListItemButton
      key={folder.id}
      sx={{ paddingLeft: "20px",paddingRight:"20px", paddingY: "4px" }}
      onClick={()=> route.push(`/${folder.id}`)}
    >
      <ListItemIcon>
        <FolderIcon sx={{ color: "white" }} />
      </ListItemIcon>
      
      <ListItemText primary={folder.name} />

      {/* Push delete icon to the right */}
      {/* <ListItemIcon  onClick={() => console.log(`Delete ${folder.name}`)} > */}
        <DeleteIcon onClick={()=>console.log("Delee")} sx={{ color: "white" }} />
      {/* </ListItemIcon> */}
    </ListItemButton>
  ))}
</List>

            </Box>
        </Stack>
    );
};

export default Folders;
