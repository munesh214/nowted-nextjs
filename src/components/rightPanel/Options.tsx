// components/Options.tsx
"use client";

import React, { useState } from 'react';
import { Box, IconButton, Avatar, Menu, MenuItem, Tooltip, Divider, ListItemIcon } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import InventoryIcon from '@mui/icons-material/Inventory';
import { deleteNote, updateNote } from '@/services/notes.api';
import { Note } from '@/types/types';
import { useParams, useRouter } from 'next/navigation';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Options = ({ noteData,
  noteTitle,
  noteContent,
  changeDlt }: { noteData: Note | undefined, noteTitle: string, noteContent: string, changeDlt: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const route = useRouter();
  const { category } = useParams()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [isFavorite, setIsFavorite] = useState(noteData!.isFavorite);
  const [isArchive, setIsArchive] = useState(noteData!.isArchived);


  const handleChangeFavoriteStatus = async () => {
    setIsFavorite((prev: boolean) => !prev);
    const updatedNote = {
      folderId: noteData!.folder.id,
      title: noteTitle,
      content: noteContent,
      isArchived: isArchive,
      isFavorite: !isFavorite,
    };

    await updateNote(noteData!.id, updatedNote);

    if (category === "favorite") route.push(`/favorite`);
  };

  const handleChangeArchiveStatus = async () => {
    setIsArchive((prev: boolean) => !prev);
    const updatedNote = {
      folderId: noteData!.folder.id,
      title: noteTitle,
      content: noteContent,
      isFavorite: isFavorite,
      isArchived: !isArchive,
    };

    await updateNote(noteData!.id, updatedNote);
    alert(!isArchive ? "Note Successfully Archived!" : "Note Successfully Unarchived!");

    if (category === "archive") route.push(`/${noteData?.folder.id}/${noteData?.id}`);
  };

  const handleDeleteNoteFunction = async () => {
    if (noteData?.id && confirm("Are you sure you want to delete this note?")) {
      await deleteNote(noteData.id);
      alert("Note Deleted Successfully!");
      changeDlt(p=>!p);
    }
  };


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32, backgroundColor: "rgba(24, 24, 24, 1)", border: "1px solid white" }}><MoreVertIcon /></Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >

        <MenuItem onClick={handleChangeFavoriteStatus}>
          <ListItemIcon>
            <StarIcon fontSize="small" />
          </ListItemIcon>
          {isFavorite ? "Unfavorite" : "Favorite"}
        </MenuItem>
        <MenuItem onClick={handleChangeArchiveStatus}>
          <ListItemIcon>
            <InventoryIcon fontSize="small" />
          </ListItemIcon>
          {isArchive ? "Unarchive" : "Archive"}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteNoteFunction}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Trash
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Options;
