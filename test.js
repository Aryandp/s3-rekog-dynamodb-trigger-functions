const handler = require("./app").handler;

const mockEvent = {
  Records: [
    {
      s3: {
        bucket: {
          name: "serverless-s3-functions-bucket",
        },
        object: {
          key: "Raviwiz_1735387944562_WhatsApp Image 2023-11-28 at 20.00.23_d13b4393.jpg",
        },
      },
    },
  ],
};

(async () => {
  try {
    // Mock environment variables
    process.env.BUCKET_NAME = "serverless-s3-functions-bucket";
    process.env.DYNAMODB_FACE_TABLE_NAME = "serverless-s3-functions-face-dynamodb-table";
    process.env.REKOG_COLLECTION_NAME = "serverless-s3-functions-face-collection";

    const result = await handler(mockEvent);
    console.log("Function Output:", result);
  } catch (error) {
    console.error("Error:", error);
  }
})();
