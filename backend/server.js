import dotenv from 'dotenv';

dotenv.config();

import process from 'process';
import http from 'http';
import db from './config/db_config.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;
 
// Initialies the Monogdb connection
await db.connect();

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
})