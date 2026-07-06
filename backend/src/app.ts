import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { auth } from './middleware/auth';
import "reflect-metadata"
import {AppDataSource} from "./database/dataSource"; //não remover -> type ORM

//Routes
import routes from "./route/route";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Database connection
AppDataSource.initialize()
    .then(() => {
        console.log("PostgresSQL server started");
    })
    .catch((error) => console.log(error))

// Apply authentication middleware globally
app.use(auth);

app.get("/api/test",(req,res,next) => {
    res.send("Authentication successful!");
});

// Using Routes
app.use(routes);

app.listen(PORT, () => {
    console.log(`Core API Service running on port ${PORT}`);
});
