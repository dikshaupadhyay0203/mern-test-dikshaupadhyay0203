import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.listen(process.env.PORT || 6000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

export default app;