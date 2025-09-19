const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the project's root directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running! Open your browser and go to http://localhost:${port}`);
});