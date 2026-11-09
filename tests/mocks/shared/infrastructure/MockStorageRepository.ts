import { StorageRepository } from '../../../../layers/common/shared/domain/StorageRepository';

export class MockStorageRepository implements StorageRepository {
  async uploadFile(
    filename: string,
    file: File | string,
    storageName: string,
    folder?: string,
  ): Promise<string> {
    const fileType = typeof file === 'string' ? 'string' : 'File';
    const key = folder ? `${folder}/${filename}` : filename;
    console.log(
      'MockStorageRepository: uploadFile',
      key,
      fileType,
      'to bucket:',
      storageName,
    );
    return `https://example.com/${key}`;
  }

  async downloadFile(url: string, storageName: string): Promise<File> {
    console.log(
      'MockStorageRepository: downloadFile',
      url,
      'from bucket:',
      storageName,
    );
    return new File([], 'file.pdf');
  }

  async deleteFile(url: string, storageName: string): Promise<void> {
    console.log(
      'MockStorageRepository: deleteFile',
      url,
      'from bucket:',
      storageName,
    );
  }
}
