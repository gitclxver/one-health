import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const CACHE_CONTROL = 'public, max-age=31536000, immutable';

@Injectable()
export class R2StorageService {
  private readonly logger = new Logger(R2StorageService.name);
  private readonly client: S3Client | null;
  private readonly bucket: string | undefined;
  private readonly publicUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('r2.endpoint');
    const accessKey = this.configService.get<string>('r2.accessKey');
    const secretKey = this.configService.get<string>('r2.secretKey');
    this.bucket = this.configService.get<string>('r2.bucket');
    this.publicUrl = this.configService.get<string>('r2.publicUrl');

    if (endpoint && accessKey && secretKey && this.bucket) {
      this.client = new S3Client({
        region: 'auto',
        endpoint,
        credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      });
    } else {
      this.client = null;
      this.logger.warn('R2 credentials incomplete — uploads will use dev placeholder URLs');
    }
  }

  isConfigured(): boolean {
    return this.client !== null && !!this.publicUrl;
  }

  getPublicUrl(storageKey: string): string {
    if (!this.publicUrl) {
      return `/uploads/${storageKey}`;
    }
    const base = this.publicUrl.replace(/\/$/, '');
    return `${base}/${storageKey}`;
  }

  async upload(
    storageKey: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    if (!this.client || !this.bucket) {
      this.logger.warn(`R2 not configured — skipping upload for ${storageKey}`);
      return this.getPublicUrl(storageKey);
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: body,
        ContentType: contentType,
        CacheControl: CACHE_CONTROL,
      }),
    );

    this.logger.log(`Uploaded ${storageKey} to R2 (${body.length} bytes)`);
    return this.getPublicUrl(storageKey);
  }

  /** Used by future background cleanup worker. */
  async delete(storageKey: string): Promise<void> {
    if (!this.client || !this.bucket) {
      throw new ServiceUnavailableException('R2 storage is not configured');
    }

    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: storageKey }),
    );
    this.logger.log(`Deleted ${storageKey} from R2`);
  }
}
