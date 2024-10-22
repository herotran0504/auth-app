import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import jwt from 'jsonwebtoken';
import {buildResponse} from "./response.js";

const awsRegion = process.env.AWS_REGION;
const userTable = process.env.USERS_TABLE;
const jwtSecret = process.env.JWT_SECRET;
const bucketName = process.env.BUCKET_NAME;
const region = `s3.us-east-1`;

const dynamoDB = new DynamoDBClient({ region: awsRegion });

export const userProfile = async (event) => {
    console.log('Received profile event:', event);

    const token = event.headers.Authorization.split(' ')[1];
    console.log('token:', token);
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const userEmail = decoded.email;

        const params = {
            TableName: userTable,
            Key: {
                email: { S: userEmail },
            },
        };

        const { Item } = await dynamoDB.send(new GetItemCommand(params));
        if (!Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' }),
            };
        }

        const userData = unmarshall(Item);

        const profileImageUrl = `https://${bucketName}.${region}.amazonaws.com/${userData.profileImage}`;

        const responseBody = {
            name: userData.name,
            email: userData.email,
            profileImage: profileImageUrl
        };

        return buildResponse(200, responseBody);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        const errorResponse = {message: 'Internal Server Error'};
        return buildResponse(500, errorResponse);
    }
};
