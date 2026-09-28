import mongoose from 'mongoose';
import ApiError from '../middlewares/error.middleware.js';
import _config from './config.js';


const connectToDB = async () => {
    try {
        await mongoose.connect(_config.DB_URL);
        console.log('Database connected successfully');
    } catch (error) {
        throw new ApiError(404, 'failed to connect Database')
    }
};


export default connectToDB;