declare module 'thaismartcardreader.js' {
  class Reader {
    on(
      event: 'device-activated',
      callback: (event: { name: string }) => Promise<void>
    ): void;

    on(event: 'error', callback: (error: Error) => Promise<void>): void;

    on(event: 'image-reading', callback: (percent: string) => void): void;

    on(
      event: 'card-inserted',
      callback: (person: {
        getCid: () => Promise<string>;
        getFirst4CodeUnderPicture: () => Promise<string>;
        getLast8CodeUnderPicture: () => Promise<string>;
        getNameTH: () => Promise<{
          prefix: string;
          firstname: string;
          lastname: string;
        }>;
        getNameEN: () => Promise<{
          prefix: string;
          firstname: string;
          lastname: string;
        }>;
        getDoB: () => Promise<{
          day: string;
          month: string;
          year: string;
        }>;
        getIssueDate: () => Promise<{
          day: string;
          month: string;
          year: string;
        }>;
        getExpireDate: () => Promise<{
          day: string;
          month: string;
          year: string;
        }>;
        getAddress: () => Promise<string>;
        getIssuer: () => Promise<string>;
        getPhoto: () => Promise<string>;
      }) => Promise<void>
    ): void;

    on(event: 'card-removed', callback: () => void): void;

    on(event: 'device-deactivated', callback: () => void): void;
  }
}
