import { ipcMain } from 'electron';
import { SerialPort } from 'serialport';

export function initializeSerialPort() {
  ipcMain.handle('get-serial-ports', async () => {
    return SerialPort.list();
  });
}
