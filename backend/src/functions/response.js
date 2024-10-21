export const buildResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        },
        body: JSON.stringify(body),
    };
};
