const AWS = require('aws-sdk');

// Configure the AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID, // Your AWS Access Key ID
    secretAccessKey: process.env.SECRET_ACCESS_KEY, // Your AWS Secret Access Key
    region: process.env.REGION, // Your AWS Region
});

module.exports = s3;