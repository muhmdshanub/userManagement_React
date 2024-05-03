import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import adminRouter from './routes/adminRoute.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import connectDB from './configs/db.js';
import initializeSocket from './configs/socket.js';

dotenv.config();
connectDB();
const port = process.env.PORT || 8000;

const app = express();
const serverNew = http.createServer(app);
const io = initializeSocket(serverNew);

app.use(cors());

// Attach the io instance to the request object
app.use((req, res, next) => {
    req.io = io; // Access the io instance set in server.js
    next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

app.get('/', (req, res) => {
    res.send("Server is running...");
});

app.use(notFound);
app.use(errorHandler);

serverNew.listen(port, () => {
    console.log(`Server started and running on http://localhost:${port}`);
});
