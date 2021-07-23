const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'fb_user';

exports.handler = async (event) => {
    console.log('Request event: ', event);
    let response;
    switch (event.httpMethod) {
        case 'GET':
            response = await getUsers();
            break;
        case 'POST':
            response = await saveUser(JSON.parse(event.body));
            break;
        case 'PUT':
            response = buildResponse(501, 'Not Implemented');
            break;
        case 'DELETE':
            response = buildResponse(501, 'Not Implemented');
            break;
    }
    return response;
};

function buildResponse(statusCode, body){
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
};

async function getUsers(){
  const params = {
      TableName: dynamodbTableName
  };
  const allProducts = await scanDynamoRecords(params, []);
  const body = {
      users: allProducts
  };
  return buildResponse(200, body);
};

async function scanDynamoRecords(scanParams, itemArray){
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if (dynamoData.LastEvaluatedKey) {
            scanParams.ExlusiveStartkey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    } 
    catch (error) {
        console.log("ERROR at scanDynamoRecords: ", error);
    }
};

async function existsUser(requestBody) {
    const paramsSearch = {
        TableName: dynamodbTableName,
        Key: {
            'facebookId': requestBody.facebookId
        }
    };
    
    let res = await dynamodb.get(paramsSearch).promise().then((response) => {
       if(response.Item != null) return true;
       return false;
    }, (error) => {
     console.log("ERROR at saveUser (false): \n", error);  
    });
    return res;
}

async function saveUser(requestBody){
    let res = await existsUser(requestBody);
    if(!res){
        const params = {
            TableName: dynamodbTableName,
            Item: requestBody
        }
        return await dynamodb.put(params).promise().then(() => {
            const body = {
                Operation: 'SAVE',
                Message: 'SUCCESS',
                Item: requestBody
            };
            return buildResponse(200, body);
        }, (error) => {
            console.log('ERROR at saveUser: ', error);
        });
    }
    else {
        return buildResponse(200, !res);
    }
    
};
