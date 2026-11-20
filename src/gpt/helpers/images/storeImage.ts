import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
require('dotenv').config();

const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
const S3_ACCESS_KEY_SECRET = process.env.S3_ACCESS_KEY_SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;

const s3 = new S3Client({
  credentials: {
    accessKeyId: S3_ACCESS_KEY!,
    secretAccessKey: S3_ACCESS_KEY_SECRET!,
  },
  region: BUCKET_REGION,
});

export async function storeImage(
  image: Buffer<ArrayBuffer>,
  uuidImage: string,
): Promise<boolean> {
  const params = {
    Bucket: BUCKET_NAME,
    Key: uuidImage,
    Body: image,
    ContentType: 'png',
  };

  const command = new PutObjectCommand(params);
  const resp = await s3.send(command);
  if (resp) {
    return true;
  }

  return false;
}

export async function getImageFromBucket(uuidImage: string): Promise<string> {
  const getObjectParams = {
    Bucket: BUCKET_NAME,
    Key: uuidImage,
  };

  const getObjectCommad = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, getObjectCommad, { expiresIn: 3600 });
  if (url) {
    return url;
  }
  return 'Error';
}
