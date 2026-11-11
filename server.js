const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/predict', (req, res) => {
    const features = req.body.features; 

    const pythonProcess = spawn('python', ['predict.py', ...features]);

    pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim();
        res.json({ success: true, prediction: result });
    });

    pythonProcess.stderr.on('data', (data) => {
        res.status(500).json({ success: false, message: 'Prediction failed' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});