const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const gadgetsRoutes = require('./routes/gadgetsRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', userRoutes);
app.use('/gadgets', gadgetsRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});



