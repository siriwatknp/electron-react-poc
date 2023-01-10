import { ipcMain, WebContents } from 'electron';
import { CardInfo } from 'main/preload';
import { Reader } from 'thaismartcardreader.js';

export function initializeCardReader() {
  let cardData: null | CardInfo = null;
  const subscribers: Array<WebContents> = [];

  const cardReader = new Reader();

  ipcMain.on('card-reader-get-data', async (event) => {
    event.returnValue = cardData;
  });

  ipcMain.on('card-reader-check', async (event) => {
    event.returnValue = !!cardData;
  });

  cardReader.on('device-activated', async (event) => {
    console.log('Device-Activated');
    console.log(event.name);
    console.log('=============================================');
  });

  cardReader.on('image-reading', (percent) => {});

  cardReader.on('card-inserted', async (person) => {
    const cid = await person.getCid();
    const first4Code = await person.getFirst4CodeUnderPicture();
    const last8Code = await person.getLast8CodeUnderPicture();
    const thName = await person.getNameTH();
    const enName = await person.getNameEN();
    const dob = await person.getDoB();
    const issueDate = await person.getIssueDate();
    const expireDate = await person.getExpireDate();
    const address = await person.getAddress();
    const issuer = await person.getIssuer();

    console.log(`CitizenID: ${cid}`);
    console.log(`First4CodeUnderPicture: ${first4Code}`);
    console.log(`Last8CodeUnderPicture: ${last8Code}`);
    console.log(
      `THName: ${thName.prefix} ${thName.firstname} ${thName.lastname}`
    );
    console.log(
      `ENName: ${enName.prefix} ${enName.firstname} ${enName.lastname}`
    );
    console.log(`DOB: ${dob.day}/${dob.month}/${dob.year}`);
    console.log(`Address: ${address}`);
    console.log(
      `IssueDate: ${issueDate.day}/${issueDate.month}/${issueDate.year}`
    );
    console.log(`Issuer: ${issuer}`);
    console.log(
      `ExpireDate: ${expireDate.day}/${expireDate.month}/${expireDate.year}`
    );

    console.log('=============================================');
    console.log('Receiving Image');
    const photo = await person.getPhoto();
    console.log('=============================================');

    cardData = {
      cid,
      first4Code,
      last8Code,
      thName,
      enName,
      dob,
      issueDate,
      expireDate,
      address,
      issuer,
      photo: Buffer.from(photo).toString('base64'),
    };

    subscribers.forEach((sub) => {
      sub.send('card-reader-connect', true);
    });
  });

  cardReader.on('card-removed', () => {
    console.log('card removed');
    subscribers.forEach((sub) => {
      sub.send('card-reader-connect', false);
    });
    cardData = null;
  });

  cardReader.on('device-deactivated', () => {
    console.log('device-deactivated');
    subscribers.forEach((sub) => {
      sub.send('card-reader-connect', false);
    });
    cardData = null;
  });

  return {
    add(webContents: WebContents) {
      subscribers.push(webContents);
    },
  };
}
