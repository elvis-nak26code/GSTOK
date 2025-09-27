// pour pouvoir manipuler le Token d'authentification

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveToken: (token) => ipcRenderer.invoke('save-token', token),
  getToken: () => ipcRenderer.invoke('get-token'),
  deleteToken: () => ipcRenderer.invoke('delete-token'),
});




