import mongoose from 'mongoose';
import Message from '../models/Message.js';

class DB {
    async connect() {
        try {
            await mongoose.connect(process.env.MONGO_URI, { 
                useNewUrlParser: true, 
                useUnifiedTopology: true 
            });
            console.log('MongoDB connected!');
        } catch (error) {
            console.error('MongoDB connection failed:', error.message);
            process.exit(1);
        }
    }

}

const db = new DB();

export default db; 