import {contextBridge, ipcRenderer} from 'electron';
import {Pages} from './data/pages';

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  nodeEnv: process.env.NODE_ENV,
  initApi: () => ipcRenderer.invoke('initApi'),
  getTitle: () => ipcRenderer.invoke('getTitle'),
  movePage: (page: Pages) => ipcRenderer.invoke('movePage', page),
  getTable: () => ipcRenderer.invoke('getTable'),
  getTableData: () => ipcRenderer.invoke('getTableData'),
  getDetails: (page: Pages, id: number) => ipcRenderer.invoke('getDetails', page, id),
  isReady: () => ipcRenderer.invoke('isReady')
})
