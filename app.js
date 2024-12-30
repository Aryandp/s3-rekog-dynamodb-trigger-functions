const rekognitionUtils = require("./utils/rekognition.js");
const dynamoDBUtils = require("./utils/dynamodb.js");

module.exports.handler = async (event) => {
  try {
    const bucketName = process.env.BUCKET_NAME;
    const tableName = process.env.DYNAMODB_FACE_TABLE_NAME;
    const collectionId = process.env.REKOG_COLLECTION_NAME;
console.log('tableName',tableName);

    // Extract S3 object key from the event
    const record = event.Records[0];
    const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    // Rekognition: Index faces
    const faceRecords = await rekognitionUtils.indexFaces(bucketName, objectKey, collectionId);

    // Save face metadata to DynamoDB
    await dynamoDBUtils.saveFaceRecords(tableName, faceRecords);

    console.log("Face metadata successfully processed and saved.");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success", faceRecords }),
    };
  } catch (error) {
    console.error("Error processing event:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
