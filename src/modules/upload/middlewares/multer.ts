import multer from 'multer';
import createCloudinaryStorage from './cloudinary';

const storageVideo = createCloudinaryStorage({ folder: 'instagram-video', resource_type: 'video' });
const storageImage = createCloudinaryStorage({ folder: 'instagram-image', resource_type: 'image' });

export const uploadVideoClient = multer({ storage: storageVideo });
export const uploadImageClient = multer({ storage: storageImage });
