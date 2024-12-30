const { RekognitionClient, SearchFacesByImageCommand } = require("@aws-sdk/client-rekognition");
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");


// Initialize Rekognition and DynamoDB clients with region from .env
const rekognitionClient = new RekognitionClient({ region: process.env.REGION });
const dynamoDBClient = new DynamoDBClient({ region: process.env.REGION });

// Read collection ID and DynamoDB table name from .env
const COLLECTION_ID = process.env.COLLECTION_ID; // Rekognition Collection ID
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE; // DynamoDB Table Name

exports.handler = async (event) => {
  try {
    // Parse incoming data
    const { imageBase64 } = JSON.parse(event.body);

    // Decode Base64 image
    const buffer = Buffer.from(imageBase64, "base64");

    // Search for matching faces in Rekognition
    const searchCommand = new SearchFacesByImageCommand({
      CollectionId: COLLECTION_ID,
      Image: {
        Bytes: buffer,
      },
      MaxFaces: 1,
      FaceMatchThreshold: 90,
    });

    const rekognitionResult = await rekognitionClient.send(searchCommand);

    if (!rekognitionResult.FaceMatches || rekognitionResult.FaceMatches.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No matching faces found" }),
      };
    }

    const faceId = rekognitionResult.FaceMatches[0].Face.FaceId;

    // Query DynamoDB for the FaceId
    const queryCommand = new QueryCommand({
      TableName: DYNAMODB_TABLE,
      IndexName: "FaceId-index", // Assuming you have a secondary index on FaceId
      KeyConditionExpression: "FaceId = :faceId",
      ExpressionAttributeValues: {
        ":faceId": { S: faceId },
      },
    });

    const dynamoResult = await dynamoDBClient.send(queryCommand);

    if (!dynamoResult.Items || dynamoResult.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No images found for the given face" }),
      };
    }

    // Extract image URLs
    const imageUrls = dynamoResult.Items.map((item) => item.ImageUrl.S);

    // Return the image URLs
    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrls }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};
