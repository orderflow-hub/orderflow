// src/routes/api/products/[id]/upload-image.ts
import { minioClient, MINIO_BUCKET } from '$lib/minio';
import type { RequestHandler } from '@sveltejs/kit';

/*
 * PATCH: Uploads the provided product image and adds its url to the database.
 * Returns a success message on update or an error message on failure.
 */
export const PATCH: RequestHandler = async ({ request, params, fetch }) => {
	// Retrieve form data containing the file and product ID
	const product_id = params.id;
	const imgFormData = await request.formData();
	const image = imgFormData.get('file') as File;

	if (!image) {
		return new Response(JSON.stringify({ error: 'Image is missing' }), {
			status: 400
		});
	}

	if (!product_id) {
		return new Response(JSON.stringify({ error: 'Product ID not specified' }), {
			status: 400
		});
	}

	try {
		// Ensure the bucket exists; create it if not
		const bucketExists = await minioClient.bucketExists(MINIO_BUCKET);
		if (!bucketExists) {
			await minioClient.makeBucket(MINIO_BUCKET);
		}

		// Extract file extension and generate a standardized file name
		const ext = image.name.split('.').pop();
		const fileName = 'image-full' + '.' + ext;

		// File save path in MinIO bucket
		const destinationObject = `products/product-id-${product_id}/media/images/${fileName}`;

		// Convert the image to a buffer and prepare metadata
		const buffer = Buffer.from(await image.arrayBuffer());
		const metaData = {
			'Content-Type': image.type
		};

		// Upload the image to MinIO
		await minioClient.putObject(MINIO_BUCKET, destinationObject, buffer, metaData);

		// Image URL for the database
		const imgUrl = `https://${import.meta.env.VITE_PUBLIC_MINIO_URL}/${MINIO_BUCKET}/${destinationObject}`;

		// Update the image URL of the product
		const updateResponse = await fetch(`/api/products/${product_id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				image_url: imgUrl
			})
		});

		// Check if the product was updated successfully
		if (!updateResponse.ok) {
			throw new Error('Failed to update product with new image URL');
		}

		return new Response(
			JSON.stringify({
				message: 'Image uploaded and product updated successfully',
				imgUrl: imgUrl
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error uploading image:', error);
		return new Response(JSON.stringify({ message: 'Failed to upload image or update product' }), {
			status: 500
		});
	}
};
