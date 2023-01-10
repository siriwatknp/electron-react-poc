import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export interface CardInfo {
  cid: string;
  first4Code: string;
  last8Code: string;
  thName: { prefix: string; firstname: string; lastname: string };
  enName: { prefix: string; firstname: string; lastname: string };
  dob: { day: string; month: string; year: string };
  issueDate: { day: string; month: string; year: string };
  expireDate: { day: string; month: string; year: string };
  address: string;
  issuer: string;
  /**
   * Base64 string
   */
  photo: string;
}

export type CardReaderData =
  | { status: 'device-activated' }
  | { status: 'device-deactivated' }
  | { status: 'card-inserted' }
  | { status: 'card-retrieved'; card: CardInfo };

export type Channels = 'ipc-example';

declare global {
  interface Window {
    electron: {
      ipcRenderer: any;
      cardReader: {
        check: () => boolean;
        connect: (
          listener: (event: Electron.IpcRendererEvent, ready: boolean) => void
        ) => () => void;
        getData: () => CardInfo | null;
      };
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    interface DOMAttributes<T> {
      onResize?: ReactEventHandler<T> | undefined;
      onResizeCapture?: ReactEventHandler<T> | undefined;
      nonce?: string | undefined;
    }
  }
}

const electronHandler: Window['electron'] = {
  cardReader: {
    check: () => ipcRenderer.sendSync('card-reader-check'),
    getData: () => ipcRenderer.sendSync('card-reader-get-data'),
    connect: (listener) => {
      ipcRenderer.on('card-reader-connect', listener);
      return () => {
        ipcRenderer.removeListener('card-reader-connect', listener);
      };
    },
  },
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
