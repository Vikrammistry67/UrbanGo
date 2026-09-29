import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
const app = express();



app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        };
    },
}));

app.get('/health', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'UrbanGo Server is up and running'
    });
});


app.use('/api/auth', authRoutes);


export default app;