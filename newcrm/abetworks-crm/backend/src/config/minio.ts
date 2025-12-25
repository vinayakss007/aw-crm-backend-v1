import * as Minio from 'minio';

// MinIO Configuration
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

// Create bucket if it doesn't exist
const bucketName = process.env.MINIO_BUCKET || 'abetworks-crm';
const bucketRegion = process.env.MINIO_REGION || 'us-east-1';

minioClient.bucketExists(bucketName, async (err, exists) => {
  if (err) {
    console.error('Error checking bucket existence:', err);
    return;
  }
  
  if (!exists) {
    try {
      await minioClient.makeBucket(bucketName, bucketRegion);
      console.log(`Bucket ${bucketName} created successfully in region ${bucketRegion}`);
    } catch (createErr) {
      console.error('Error creating bucket:', createErr);
    }
  } else {
    console.log(`Bucket ${bucketName} already exists`);
  }
});

export default minioClient;
export { bucketName };