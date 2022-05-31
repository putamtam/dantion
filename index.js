import { createRequire } from "module";
const require = createRequire(import.meta.url);

import express from 'express';
import upload from 'express-fileupload';
require('dotenv').config();

import usersRoutes from './routes/users.js';
import detectionRoutes from './routes/detections.js';
import placeRoutes from './routes/places.js';

const app = express();
const PORT = process.env.BASE_URL_PORT;
const URL = `${process.env.BASE_URL}:${PORT}`;

app.use(express.urlencoded({extended: false}));
app.use(upload({ createParentPath: true }));

app.use('/users', usersRoutes);
app.use('/detections', detectionRoutes);
app.use('/places', placeRoutes);

app.get('/', (req, res) => {
    res.send("Ini halaman index");
});

app.listen(PORT, () => console.log(`Server running on port: ${URL}`));
