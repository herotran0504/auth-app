import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import jwt from 'jsonwebtoken';

const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });
const s3 = new S3Client({ region: 'us-east-1' });

const BucketName = process.env.BUCKET_NAME;
const USERS_TABLE = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;

export const uploadImage = async (event) => {
    const token = event.headers.Authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userEmail = decoded.email;

        const { fileName } = JSON.parse(event.body);
        const imageKey = `profile-images/${userEmail}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: BucketName,
            Key: imageKey,
            ContentType: 'image/jpeg',
        });

        const preSignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        const updateParams = {
            TableName: USERS_TABLE,
            Key: {
                email: { S: userEmail },
            },
            UpdateExpression: 'SET profileImage = :newImage',
            ExpressionAttributeValues: {
                ':newImage': { S: imageKey },
            },
        };

        await dynamoDB.send(new UpdateItemCommand(updateParams));

        return {
            statusCode: 200,
            body: JSON.stringify({ preSignedUrl }),
        };
    } catch (error) {
        console.error('Error updating profile image:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
