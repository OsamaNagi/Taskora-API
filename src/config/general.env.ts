import env from './env';

export const accessTokenSecret = env('ACCESS_TOKEN_SECRET');
export const refreshTokenSecret = env('REFRESH_TOKEN_SECRET');
export const accessTokenExpiry = env('ACCESS_TOKEN_EXPIRY');
export const refreshTokenExpiry = env('REFRESH_TOKEN_EXPIRY');
export const bcryptSaltRounds = env('BCRYPT_SALT_ROUNDS');
export const cloudinaryCloudName = env('CLOUDINARY_CLOUD_NAME');
export const cloudinaryApiKey = env('CLOUDINARY_API_KEY');
export const cloudinaryApiSecret = env('CLOUDINARY_API_SECRET');
