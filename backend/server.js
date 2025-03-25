import path from 'path';
import express from "express";
import authRoutes from "./routes/auth.route.js"
import dotenv from 'dotenv';
import connectDB from "./lib/mongodb.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import clientRoutes from "./routes/client.route.js"
import serviceRoutes from "./routes/service.route.js";
import { startExpirationCheck } from './mail/mail.js';
import providerRoutes from "./routes/provider.route.js"

dotenv.config()

const port= process.env.PORT || 5000;
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}
))

app.use("/api/auth", authRoutes)
app.use('/api/client', clientRoutes); 
app.use('/api/service', serviceRoutes);
app.use('/api/service-provider', providerRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectDB();
  startExpirationCheck();
})

