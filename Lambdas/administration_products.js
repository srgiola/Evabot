const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'producto';

exports.handler = async (event) => {
    let response;
    switch (event.httpMethod) {
        case 'GET':
            if (event.queryStringParameters.type === '1') {
                response = await getProductsByType(event.queryStringParameters.productType);
            }
            else if(event.queryStringParameters.type === '2'){
                response = await getProductsByFilter(event.queryStringParameters.productVar);
            }
            else{
                response = await getProducts();
            }
            break;
        case 'POST':
            response = buildResponse(501, 'Not Implemented');
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

async function getProducts(){
  const params = {
      TableName: dynamodbTableName
  };
  const allProducts = await scanDynamoRecords(params, []);
  const body = {
      products: allProducts
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

async function getProductsByType(productType){
    const params = {
        TableName: dynamodbTableName,
    };
    const body = {
        products: []
    };
    const allProducts = await scanDynamoRecords(params, []);
    allProducts.forEach(element => {
        let des = element.type.toUpperCase();
        productType = productType.toUpperCase();
        
        if(des.includes(productType)) {
            body.products.push(element);
        }
    });
    return buildResponse(200, body);
};

async function getProductsByFilter(productVar){
    const body = {products : []};
    const params = {
        TableName: dynamodbTableName
    };
    
    const allProducts = await scanDynamoRecords(params, []);
    allProducts.forEach(element => {
        let des = element.description;
        let nm = element.name;
        productVar = productVar.toUpperCase()
        
        if(des.includes(productVar) || nm.includes(productVar)) {
            body.products.push(element);
        }
    });
    return buildResponse(200, body);
};