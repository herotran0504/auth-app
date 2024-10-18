import {DynamoDBClient, GetItemCommand, PutItemCommand} from '@aws-sdk/client-dynamodb';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';

const dynamoDB = new DynamoDBClient({region: 'us-east-1'});
const s3 = new S3Client({region: 'us-east-1'});

const BucketName = process.env.BUCKET_NAME
const TableName = process.env.USERS_TABLE

export const signup = async (event) => {
    const {email, password, name, fileName} = JSON.parse(event.body);

    try {
        const userCheckParams = {
            TableName: TableName,
            Key: {email: {S: email}}
        };

        const {Item} = await dynamoDB.send(new GetItemCommand(userCheckParams));

        if (Item) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'User with this email already exists'}),
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const imageKey = `profile-images/${uuidv4()}_${fileName}`;

        const command = new PutObjectCommand({
            Bucket: BucketName,
            Key: imageKey,
            ContentType: 'image/jpeg',
        });

        const preSignedUrl = await getSignedUrl(s3, command, {expiresIn: 3600});

        const params = {
            TableName: TableName,
            Item: {
                email: {S: email},
                password: {S: hashedPassword},
                name: {S: name},
                profileImage: {S: imageKey},
                id: {S: uuidv4()},
            },
        };

        await dynamoDB.send(new PutItemCommand(params));
        return {
            statusCode: 201,
            body: JSON.stringify({message: 'User created successfully', preSignedUrl, imageKey}),
        };
    } catch (error) {
        console.error('Error in signup:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'}),
        };
    }
};
