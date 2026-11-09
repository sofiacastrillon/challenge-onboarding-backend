import { StorageRepository } from '../../domain/StorageRepository';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Env } from '../../domain/interfaces/IEnvironment';
import { injectable } from 'tsyringe';
import { getEnv } from '../../../utils/Utils';

@injectable()
export class S3Repository implements StorageRepository {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: getEnv(Env.AWS_REGION_ID),
    });
  }

  private getContentType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      json: 'application/json',
      txt: 'text/plain',
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      xml: 'application/xml',
      zip: 'application/zip',
    };
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }

  async uploadFile(
    filename: string,
    file: File | string,
    storageName: string,
    folder?: string,
  ): Promise<string> {
    let body: Uint8Array;
    let contentType: string;

    if (typeof file === 'string') {
      body = new TextEncoder().encode(file);
      contentType = this.getContentType(filename);
    } else {
      const arrayBuffer = await file.arrayBuffer();
      body = new Uint8Array(arrayBuffer);
      contentType = file.type || this.getContentType(filename);
    }

    const key = folder ? `${folder}/${filename}` : filename;

    const command = new PutObjectCommand({
      Bucket: storageName,
      Body: body,
      Key: key,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return `https://${storageName}.s3.amazonaws.com/${key}`;
  }

  async downloadFile(url: string, storageName: string): Promise<File> {
    const key = url.split('/').pop() || '';

    const command = new GetObjectCommand({
      Bucket: storageName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const bodyBytes = await response.Body?.transformToByteArray();

    if (!bodyBytes) {
      throw new Error('Failed to download file: No body in response');
    }

    return new File([bodyBytes], url);
  }

  async deleteFile(url: string, storageName: string): Promise<void> {
    const key = url.split('/').pop() || '';

    const command = new DeleteObjectCommand({
      Bucket: storageName,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
