const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;
const windowSize = 10;
let numbers = [];
let windowPrevState = [];

app.get('/numbers/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const response = await axios.get(`http://third-party-server.com/numbers/${id}`);
        const newNumbers = response.data.numbers;

        newNumbers.forEach(num => {
            if (!numbers.includes(num)) {
                if (numbers.length >= windowSize) {
                    numbers.shift();
                }
                numbers.push(num);
            }
        });

        windowPrevState = [...numbers];

        const avg = numbers.length > 0 ? (numbers.reduce((sum, num) => sum + num, 0) / numbers.length).toFixed(2) : 0;

        res.json({
            windowPrevState,
            windowCurrState: [...numbers],
            numbers,
            avg
        });
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
