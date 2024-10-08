const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Import CORS
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Middleware to parse JSON requests
app.use(express.json());

// POST endpoint
app.post('/submit-survey', (req, res) => {
    const receivedData = req.body;
    const dataToSave = JSON.stringify(receivedData, null, 2);
    const filePath = path.join(__dirname, 'surveyData.txt');

    fs.appendFile(filePath, `${dataToSave}\n\n---\n\n`, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ message: 'Error saving data' });
        }
        console.log('Data saved to file');
        res.json({ message: 'Survey data received and saved!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
