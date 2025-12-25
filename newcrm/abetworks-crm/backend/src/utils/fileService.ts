import minioClient, { bucketName } from '../config/minio';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Define MinIO types to avoid import issues
interface BucketItemStat {
  size: number;
  etag: string;
  versionId: string | null;
  lastModified: Date;
  metaData: Record<string, string>;
}

interface FileUploadResult {
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: Date;
}

class FileService {
  /**
   * Upload a file to MinIO
   * @param fileBuffer - The file buffer to upload
   * @param originalName - The original name of the file
   * @param userId - The ID of the user uploading the file
   * @param entityType - The type of entity the file is associated with (e.g., 'account', 'contact', 'opportunity')
   * @param entityId - The ID of the entity the file is associated with
   * @returns FileUploadResult with information about the uploaded file
   */
  static async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    userId: string,
    entityType: string,
    entityId: string
  ): Promise<FileUploadResult> {
    // Generate a unique file name
    const fileExtension = path.extname(originalName);
    const fileName = `${entityType}/${entityId}/${uuidv4()}${fileExtension}`;

    // Upload to MinIO
    await minioClient.putObject(bucketName, fileName, fileBuffer, fileBuffer.length, {
      'Content-Type': this.getMimeType(originalName),
      'x-amz-meta-user-id': userId,
      'x-amz-meta-entity-type': entityType,
      'x-amz-meta-entity-id': entityId,
    });

    // Generate the file URL
    const fileUrl = await this.generateFileUrl(fileName);

    return {
      fileName,
      originalName,
      size: fileBuffer.length,
      mimeType: this.getMimeType(originalName),
      url: fileUrl,
      uploadedAt: new Date(),
    };
  }

  /**
   * Get a file from MinIO
   * @param fileName - The name of the file in MinIO
   * @returns Buffer containing the file content
   */
  static async getFile(fileName: string): Promise<Buffer> {
    const fileStream = await minioClient.getObject(bucketName, fileName);
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      fileStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      fileStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      fileStream.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Generate a presigned URL for a file
   * @param fileName - The name of the file in MinIO
   * @param expiry - Expiry time in seconds (default 24 hours)
   * @returns Presigned URL for the file
   */
  static async generateFileUrl(fileName: string, expiry: number = 86400): Promise<string> {
    const presignedUrl = await minioClient.presignedGetObject(bucketName, fileName, expiry);
    return presignedUrl;
  }

  /**
   * Delete a file from MinIO
   * @param fileName - The name of the file in MinIO
   */
  static async deleteFile(fileName: string): Promise<void> {
    await minioClient.removeObject(bucketName, fileName);
  }

  /**
   * Get file metadata from MinIO
   * @param fileName - The name of the file in MinIO
   * @returns File metadata
   */
  static async getFileMetadata(fileName: string): Promise<BucketItemStat> {
    const metadata = await minioClient.statObject(bucketName, fileName);
    return metadata as unknown as BucketItemStat;
  }

  /**
   * Get the MIME type based on file extension
   * @param fileName - The name of the file
   * @returns MIME type string
   */
  private static getMimeType(fileName: string): string {
    const extension = path.extname(fileName).toLowerCase();

    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.txt': 'text/plain',
      '.csv': 'text/csv',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.zip': 'application/zip',
      '.rar': 'application/vnd.rar',
      '.7z': 'application/x-7z-compressed',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.avi': 'video/x-msvideo',
      '.mov': 'video/quicktime',
    };

    return mimeTypes[extension] || 'application/octet-stream';
  }
}

export default FileService;