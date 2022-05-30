import express from 'express';

import usersRoutes from './routes/users.js';

const app = express();
const PORT = 5000;

app.use(express.urlencoded({extended: false}));

app.use('/users', usersRoutes);

app.get('/', (req, res) => {
    res.send("Ini halaman index");
})

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))