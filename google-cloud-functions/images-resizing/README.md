# images-resizing google cloud function

## Description

Google cloud function to resize uploaded images which will be called every time the user upload files to the special bucket.

## Creation

1. Open function creation page https://console.cloud.google.com/functions/add?project=contrib-dev

Function name: images-resizing
Region: us-central1
Trigger type: Cloud Storage
Event type: Finalize/Create
Bucket: your bucket on which we will upload images to resize

2. use code from index.js and package.json files
3. enter "Entry point" as `resizeUploadedImage`
