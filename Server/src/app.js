import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
const app = express();


// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'UrbanGo Server is up and running'
    });
});


app.use('/api/auth', authRoutes);


export default app;