"use client";
import { useState, useRef, useEffect } from "react";
import { Box, IconButton, List, ListItemButton, ListItemText, Stack, TextField, Typography } from "@mui/material";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFolders, createFolder, updateFolder, deleteFolder } from "@/services/folders.api";
import { useParams, useRouter } from "next/navigation";

const Folders = () => {
  const router = useRouter();
  const {category} = useParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });

  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderNames, setFolderNames] = useState<{ [key: string]: string }>({});

  // Redirect to the first folder when data is available
  useEffect(() => {
    if (data && data.length > 0 && !category) {
      router.push(`/${data[0].id}`);
    }
  }, [data, router,category]);

  // Mutation for creating a new folder
  const createFolderMutation = useMutation({
    mutationFn: () => createFolder({ name: "New Folder" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] }); // Refetch folders
    },
    onError: (error) => {
      console.error("Failed to create folder:", error);
    },
  });

  // Mutation for renaming a folder
  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateFolder(id, { name }),
    onSuccess: () => {
      setEditingFolderId(null); // Exit edit mode
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({queryKey:["notes",category]}) // Refetch folders
    },
    onError: (error) => {
      console.error("Failed to rename folder:", error);
    },
  });

  // Mutation for deleting a folder
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] }); // Refetch folders after deletion
      setTimeout(()=>{
        router.push(`/`);
      },200)
      
    },
    onError: (error) => {
      console.error("Failed to delete folder:", error);
    },
  });

  if (isLoading) return <Typography color="white">Loading...</Typography>;
  if (isError) return <Typography color="red">Error loading folders</Typography>;

  const handleCreateFolder = () => {
    createFolderMutation.mutate();
  };

  const handleDoubleClick = (folderId: string, folderName: string) => {
    setEditingFolderId(folderId);
    setFolderNames((prev) => ({ ...prev, [folderId]: folderName }));
    setTimeout(() => inputRef.current?.focus(), 100); // Auto-focus input
  };

  const handleRenameSubmit = (folderId: string) => {
    if (!folderNames[folderId]?.trim()) return;
    renameMutation.mutate({ id: folderId, name: folderNames[folderId] });
  };

  return (
    <Stack color="white" height="100%">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2.5}>
        <Typography color="inherit" variant="body2" fontWeight={600}>
          Folders
        </Typography>
        <IconButton size="medium" color="inherit" onClick={handleCreateFolder}>
          <CreateNewFolderOutlinedIcon color="inherit" />
        </IconButton>
      </Box>

      {/* Scrollable List */}
      <Box overflow="auto">
        <List disablePadding>
          {data?.map((folder: { id: string; name: string }) => (
            <ListItemButton
              key={folder.id}
              sx={{ paddingX: "20px", paddingY: "4px", display: "flex", alignItems: "center", gap: 2,bgcolor: category === folder.id ? "secondary.main" : "transparent" }}
              onClick={() => router.push(`/${folder.id}`)}
              onDoubleClick={() => handleDoubleClick(folder.id, folder.name)}
            >
              <FolderIcon sx={{ color: "white" }} />

              {editingFolderId === folder.id ? (
                <TextField
                  inputRef={inputRef}
                  variant="outlined"
                  size="small"
                  value={folderNames[folder.id] || folder.name}
                  onChange={(e) =>
                    setFolderNames((prev) => ({ ...prev, [folder.id]: e.target.value }))
                  }
                  onBlur={() => handleRenameSubmit(folder.id)}
                  onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit(folder.id)}
                  autoFocus
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "4px",
                    "& .MuiOutlinedInput-input": {
                      padding: "2px 5px",
                    },
                  }}
                />
              ) : (
                <ListItemText primary={folderNames[folder.id] || folder.name} sx={{ color: "white" }} />
              )}

              <IconButton size="small" onClick={() => deleteMutation.mutate(folder.id)}>
                <DeleteIcon sx={{ color: "white" }} />
              </IconButton>
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Stack>
  );
};

export default Folders;
