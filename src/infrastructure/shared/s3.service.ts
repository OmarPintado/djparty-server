import { v4 as uuidv4 } from 'uuid';
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { extname } from 'path';

export class S3Service {
    private readonly s3: S3Client;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        const fileKey = `${uuidv4()}${extname(file.originalname)}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            Body: file.buffer,
            ACL: 'public-read',
        });

        await this.s3.send(command);

        return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

    async deleteFile(fileKey: string): Promise<void> {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;

        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
        });

        await this.s3.send(command);
    }
}
