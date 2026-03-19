require('dotenv').config()
const app = require('./src/app')
const path = require('path')

app.use(require('express').static(path.join(__dirname, 'public')));

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT} `);
});