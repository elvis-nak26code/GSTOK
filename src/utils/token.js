import { ipcRenderer } from "electron";

export const saveToken = async (token) => {
  return await ipcRenderer.invoke("save-token", token);
};

export const getToken = async () => {
  return await ipcRenderer.invoke("get-token");
};

export const deleteToken = async () => {
  return await ipcRenderer.invoke("delete-token");
};