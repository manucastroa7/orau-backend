import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as toStream from 'streamifier';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Starting Cloudinary upload...');
            const upload = cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error('Cloudinary upload returned no result'));
                }
                console.log('Cloudinary Upload Success:', result.secure_url);
                console.log('Full Cloudinary Result:', JSON.stringify(result));
                resolve(result);
            });
            toStream.createReadStream(file.buffer).pipe(upload);
        });
    }
}
