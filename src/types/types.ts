export interface Note {
  id: string;
  folderId: string;
  title: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  preview?: string;
  content?: string;
  folder: Folder;
}


export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FetchNotesParams {
  archived?: boolean;
  favorite?: boolean;
  deleted?: boolean;
  folderId?: string;
  page: number;
  limit: number;
  search?: string;
}

export interface CreateAndUpdateNoteParams {
  folderId: string;
  title: string;
  content: string | undefined;
  isFavorite: boolean;
  isArchived: boolean;
}

export interface FolderPayload {
  name: string;
}

export interface CreateNoteResponse {
  id: string;  
}
