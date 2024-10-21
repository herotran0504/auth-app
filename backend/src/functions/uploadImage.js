import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import jwt from 'jsonwebtoken';
import {buildResponse} from "./response.js";

const awsRegion = process.env.AWS_REGION;
const bucketName = process.env.BUCKET_NAME;
const userTable = process.env.USERS_TABLE;
const jwtSecret = process.env.JWT_SECRET;

const dynamoDB = new DynamoDBClient({ region: awsRegion });
const s3 = new S3Client({ region: awsRegion });

export const uploadImage = async (event) => {
    console.log('Received upload image event:', event);
    const token = event.headers.Authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const userEmail = decoded.email;

        const { fileName } = JSON.parse(event.body);
        const imageKey = `profile-images/${userEmail}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: imageKey,
            ContentType: 'image/jpeg',
        });

        const preSignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        console.log('preSignedUrl:', preSignedUrl);
        const updateParams = {
            TableName: userTable,
            Key: {email: { S: userEmail },},
            UpdateExpression: 'SET profileImage = :newImage',
            ExpressionAttributeValues: {':newImage': { S: imageKey },},
        };
        console.log('updateParams:', updateParams);
        await dynamoDB.send(new UpdateItemCommand(updateParams));

        console.log('updateParams:', updateParams);
        const responseBody = { preSignedUrl}
        return buildResponse(200, responseBody);
    } catch (error) {
        console.error('Error updating profile image:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};
