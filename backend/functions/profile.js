import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import jwt from 'jsonwebtoken';

const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });
const USERS_TABLE = process.env.USERS_TABLE;
const JWT_SECRET = process.env.JWT_SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;

export const userProfile = async (event) => {
    const token = event.headers.Authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userEmail = decoded.email;

        const params = {
            TableName: USERS_TABLE,
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

        const userData = unmarshall(Item); // Convert the DynamoDB item to a regular object

        // Construct the full URL for the profile image
        const profileImageUrl = `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${userData.profileImage}`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                profileImage: profileImageUrl, // Return the full image URL
            }),
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching user profile' }),
        };
    }
};
