import process, { send } from 'process';
import http from 'http';
import db from './config/db_config.js';
import app from './app.js';
import dotenv from 'dotenv';

const PORT = process.env.PORT || 5000;

dotenv.config();
 
// Initialies the Monogdb connection
await db.connect();

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
})