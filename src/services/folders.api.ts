import { Folder, FolderPayload } from "@/types/types";
import apiClient from "./apiClient";

export const fetchFolders = async ():Promise<Folder[]> => {
    try {
        const response = await apiClient.get('/folders');
        return response.data.folders;
    } catch (error) {
        console.error(error);
        throw new Error("Unable to fetch Folders");
    }
}

export const createFolder = async (params: FolderPayload):Promise<void> => {
    try {
        await apiClient.post("/folders", params);
    } catch (error) {
        console.error(error);
        throw new Error("Error in creating folders");
    }
}

export const updateFolder = async (id: string, folderData: FolderPayload): Promise<void> => {
    try {
        await apiClient.patch(`/folders/${id}`, folderData);
    } catch (error) {
        console.error(error);
        throw new Error("Error in Updating Folder name");
    }
};

export const deleteFolder = async (id:string): Promise<void> =>{
    try {
        await apiClient.delete(`/folders/${id}`);
    }catch(error) {
        console.error(error);
        throw new Error("Error in Deleting the folder");
    }
}