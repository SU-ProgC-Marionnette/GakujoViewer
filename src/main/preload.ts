import {contextBridge, ipcRenderer} from 'electron';
import { Pages } from './data/pages'

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  nodeEnv: process.env.NODE_ENV,
  initApi: () => ipcRenderer.invoke('initApi'),
  getTitle: () => ipcRenderer.invoke('getTitle'),
  movePage: (page: Pages) => ipcRenderer.invoke('movePage', page),
})
