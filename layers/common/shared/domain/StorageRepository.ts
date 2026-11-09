export interface StorageRepository {
  uploadFile(
    filename: string,
    file: File | string,
    storageName: string,
    folder?: string,
  ): Promise<string>;
  downloadFile(url: string, storageName: string): Promise<File>;
  deleteFile(url: string, storageName: string): Promise<void>;
}
