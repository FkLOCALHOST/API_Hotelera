import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'djqjmyuoc',
    api_key: process.env.API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
