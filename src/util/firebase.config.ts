// configure firebase admin storage
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

const serviceAccount = require('../../serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://geepx-2c6b5.appspot.com'
});
const bucket = admin.storage().bucket();

export const uploadFile = (file: any):Promise<String> => {
    return new Promise(async(resolve, reject) => {
    // Read the file from the temporary folder
    const fileBuffer = await fs.promises.readFile(file.path);
    // Create a unique file name
    const fileName = `${path.parse(file.path).name}_${Date.now()}${path.parse(file.path).ext}`;
    // Upload the file to Firebase Storage
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype // or the file mimetype
        }
    });

    stream.on('error', (err) => {
        reject(`Error uploading image: ${err}`);
    });

    stream.on('finish', async () => {
        // Get the public URL of the file
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media`;
        // console.log(publicUrl);
        // Store the public URL in the User model
        resolve(publicUrl);
    });

    stream.end(fileBuffer);
    });
}
