const express = require('express')
const app = express();
const cors = require('cors')
const downloadRouter = require('./routes/download.routes')

app.use(express.json());
app.use(cors())
app.use("/api", downloadRouter)



module.exports = app;
