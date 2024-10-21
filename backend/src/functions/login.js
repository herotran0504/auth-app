import {DynamoDBClient, GetItemCommand} from '@aws-sdk/client-dynamodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {buildResponse} from "./response.js";

const awsRegion = process.env.AWS_REGION;
const dynamoDB = new DynamoDBClient({region: awsRegion});
const jwtSecret = process.env.JWT_SECRET

export const login = async (event) => {
    console.log('Received login event:', event);
    const {email, password} = JSON.parse(event.body);

    try {
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

        const validPassword = await bcrypt.compare(password, Item.password.S);
        if (!validPassword) {
            return {
                statusCode: 401,
                body: JSON.stringify({message: 'Invalid password'}),
            };
        }

        const token = jwt.sign({email: email}, jwtSecret, {expiresIn: '1h'});

        const responseBody = {
            message: 'Login successful',
            token: token,
        };

        return buildResponse(200, responseBody);
    } catch (error) {
        console.error('Error in login:', error);
        const errorResponse = {message: 'Internal Server Error'};
        return buildResponse(500, errorResponse);
    }
};
