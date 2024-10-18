// functions/uploadImage.js

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // Importing S3 client
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({ region: "us-east-1" }); // Update to your region
const S3_BUCKET = "htran-image-stores"; // Your S3 bucket name

export const handler = async (event) => {
    const { email, imageBase64 } = JSON.parse(event.body);
    const fileName = `${email}-profile-image-${uuidv4()}.png`; // Unique filename

    const buffer = Buffer.from(imageBase64, 'base64');

    const params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: 'image/png',
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const imageUrl = `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Image uploaded successfully!',
                imageUrl,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error uploading image',
                error: error.message,
            }),
        };
    }
};
