import * as Minio from 'minio';

export const MINIO_BUCKET = 'orderflow';

export const minioClient = new Minio.Client({
	endPoint: import.meta.env.VITE_PUBLIC_MINIO_URL,
	port: 443,
	useSSL: true,
	accessKey: process.env.MINIO_ACCESS_KEY || '',
	secretKey: process.env.MINIO_SECRET_KEY || ''
});
