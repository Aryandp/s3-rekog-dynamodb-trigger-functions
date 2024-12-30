const { DynamoDBClient, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDB = new DynamoDBClient({ region: "ap-south-1" }); // Replace with your AWS region

/**
 * Save face records to DynamoDB in batches.
 * @param {string} tableName - The name of the DynamoDB table.
 * @param {Array} faceRecords - Array of face records to save.
 */
async function saveFaceRecords(tableName, faceRecords) {
    const MAX_BATCH_SIZE = 25; // DynamoDB batch write limit

    if (!Array.isArray(faceRecords) || faceRecords.length === 0) {
        console.error("No face records to save.");
        return;
    }

    console.log(`Using DynamoDB table: ${tableName}`);
    console.log("Face records to save:", JSON.stringify(faceRecords, null, 2));

    // Prepare items for DynamoDB
    const items = faceRecords.map((face) => ({
        PutRequest: {
            Item: {
                FaceId: { S: face.FaceId },
                ImageId: { S: face.FileName || "N/A" },
                Metadata: { S: JSON.stringify(face) }, // Serialize face object
                Timestamp: { S: new Date().toISOString() },
            },
        },
    }));

    for (let i = 0; i < items.length; i += MAX_BATCH_SIZE) {
        const chunk = items.slice(i, i + MAX_BATCH_SIZE);
        const params = {
            RequestItems: {
                [tableName]: chunk,
            },
        };

        console.log("Batch write params:", JSON.stringify(params, null, 2));

        try {
            const command = new BatchWriteItemCommand(params);
            const result = await dynamoDB.send(command);

            // Check for unprocessed items
            if (
                result.UnprocessedItems &&
                result.UnprocessedItems[tableName] &&
                result.UnprocessedItems[tableName].length > 0
            ) {
                console.warn(
                    `Unprocessed items: ${JSON.stringify(
                        result.UnprocessedItems[tableName],
                        null,
                        2
                    )}`
                );
            }

            console.log(`Batch write success for ${chunk.length} items.`);
        } catch (error) {
            console.error(`Error saving batch to DynamoDB: ${error.message}`);
        }
    }
}

module.exports = { saveFaceRecords };
