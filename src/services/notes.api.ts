import apiClient from "./apiClient";
import { CreateAndUpdateNoteParams, CreateNoteResponse, FetchNotesParams,Note } from "@/types/types";

export const fetchRecentsNotes = async ():Promise<Note[]> => {
  try {
    const response = await apiClient.get("/notes/recent");
    return response.data.recentNotes;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch Recents Notes");
  }
};

export const getNotes = async (params: FetchNotesParams):Promise<Note[]> => {
  try {
    const response = await apiClient.get("/notes", { params });
    return response.data.notes;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch Notes");
  }
};

export const createNote = async (params: CreateAndUpdateNoteParams):Promise<CreateNoteResponse> => {
  try {
    const response = await apiClient.post("/notes", { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to create Note");
  }
}

export const getNoteById = async (id: string):Promise<Note> => {
  try {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data.note;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch Note Data");
  }
}

export const updateNote = async (id: string, noteData: CreateAndUpdateNoteParams):Promise<void> => {
  try {
    await apiClient.patch(`/notes/${id}`, noteData);
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error("Error in updating Note Data");
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/notes/${id}`);
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error("Error in Deleting the Note");
  }
};

export const restoreNote = async (id: string): Promise<void> => {
  try {
    await apiClient.post(`/notes/${id}/restore`);
  } catch (error) {
    console.error(error);
    throw new Error("Error in Restoring the Note");
  }
}
