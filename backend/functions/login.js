import {DynamoDBClient, GetItemCommand} from '@aws-sdk/client-dynamodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const dynamoDB = new DynamoDBClient({region: 'us-east-1'});
const JWT_SECRET = process.env.JWT_SECRET

export const login = async (event) => {
    const {email, password} = JSON.parse(event.body);

    try {
        // Step 1: Check if user exists in DynamoDB
        const userCheckParams = {
            TableName: process.env.USERS_TABLE,
            Key: {email: {S: email},},
        };

        const {Item} = await dynamoDB.send(new GetItemCommand(userCheckParams));

        if (!Item) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'User not found'}),
            };
        }

        // Step 2: Compare provided password with the stored hashed password
        const validPassword = await bcrypt.compare(password, Item.password.S);
        if (!validPassword) {
            return {
                statusCode: 401,
                body: JSON.stringify({message: 'Invalid password'}),
            };
        }

        // Step 3: Generate JWT token
        const token = jwt.sign({email: email}, JWT_SECRET, {expiresIn: '1h'});

        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Login successful', token}),
        };
    } catch (error) {
        console.error('Error in login:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'}),
        };
    }
};
