// app.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.static('public')); // if you have css or client-side javascript files

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Serve HTML page at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-text', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: "text-ada-001", // Updated to use text-davinci-003 model
            prompt: prompt,
            max_tokens: 150,
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
        });

        res.json({ generated_text: response.data.choices[0].text }); // Make sure to reference 'text' for the response
    } catch (error) {
        console.error("Error occurred: ", error);
        if (error.response) {
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
            res.status(500).send("An error occurred: " + error.response.data.error.message);
        } else if (error.request) {
            console.error(error.request);
            res.status(500).send("No response received");
        } else {
            console.error('Error', error.message);
            res.status(500).send("Error in setting up the request");
        }
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
