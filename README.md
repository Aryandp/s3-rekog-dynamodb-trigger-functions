# Serverless S3 Rekognition DynamoDB

This project demonstrates how to build a serverless application using AWS Lambda, S3, DynamoDB, and Rekognition services. The application uploads images to an S3 bucket, performs face recognition using AWS Rekognition, and stores metadata in DynamoDB. The entire architecture is managed using the Serverless Framework.

## Features

- **S3 Bucket Integration**: Automatically trigger Lambda function on object creation in S3.
- **Face Recognition**: Use AWS Rekognition to detect and store face data in the collection.
- **DynamoDB Storage**: Store face metadata (such as face IDs) in DynamoDB for efficient search.
- **Serverless Framework**: Easily deploy and manage the infrastructure and Lambda functions.

## Technologies

- **AWS Lambda**: Serverless functions to handle image processing and face recognition.
- **Amazon S3**: Used for storing images.
- **AWS Rekognition**: Detects and indexes faces in images.
- **Amazon DynamoDB**: Stores metadata for faces in the images.
- **API Gateway**: Exposes an API to interact with the system (for future extensions).
- **Serverless Framework**: Used for deploying and managing the serverless architecture.


