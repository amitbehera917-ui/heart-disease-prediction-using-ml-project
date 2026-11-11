const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();

// Project directory
const ROOT_DIR = __dirname;
const INDEX_FILE = path.join(ROOT_DIR, 'index.html');

// Middleware
app.use(cors());
app.use(express.json());

// Verify frontend exists
console.log('Project directory:', ROOT_DIR);
console.log('index.html exists:', fs.existsSync(INDEX_FILE));

// Serve frontend assets
app.use(express.static(ROOT_DIR, {
    index: false,
    dotfiles: 'deny'
}));

// Homepage route
app.get('/', (req, res) => {
    if (!fs.existsSync(INDEX_FILE)) {
        console.error('ERROR: index.html not found:', INDEX_FILE);

        return res.status(500).send(
            'Frontend error: index.html is missing from the deployed project.'
        );
    }

    res.sendFile(INDEX_FILE, (err) => {
        if (err) {
            console.error('Homepage error:', err);
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        server: 'running',
        frontend: fs.existsSync(INDEX_FILE)
            ? 'available'
            : 'missing'
    });
});

// Prediction API
app.post('/predict', (req, res) => {

    const features = req.body.features;

    // Validate features
    if (!Array.isArray(features) || features.length !== 13) {
        return res.status(400).json({
            success: false,
            message: 'Exactly 13 patient features are required.'
        });
    }

    const numericFeatures = features.map(Number);

    if (numericFeatures.some(value => !Number.isFinite(value))) {
        return res.status(400).json({
            success: false,
            message: 'Invalid patient feature values.'
        });
    }

    // Python executable
    const pythonCommand =
        process.env.PYTHON_PATH ||
        (process.platform === 'win32' ? 'python' : 'python3');

    const pythonProcess = spawn(
        pythonCommand,
        [
            path.join(ROOT_DIR, 'predict.py'),
            ...numericFeatures.map(String)
        ],
        {
            cwd: ROOT_DIR
        }
    );

    let output = '';
    let errorOutput = '';
    let responseSent = false;

    // Python output
    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    // Python errors
    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error('Python:', data.toString());
    });

    // Process launch error
    pythonProcess.on('error', (error) => {
        if (responseSent) return;

        responseSent = true;

        console.error('Python launch failed:', error);

        res.status(500).json({
            success: false,
            message: 'Unable to start Python.'
        });
    });

    // Process completion
    pythonProcess.on('close', (code) => {

        if (responseSent) return;

        responseSent = true;

        if (code !== 0) {
            console.error('Prediction failed:', errorOutput);

            return res.status(500).json({
                success: false,
                message: 'ML prediction failed.'
            });
        }

        const prediction = output.trim();

        if (!prediction || !['0', '1'].includes(prediction)) {
            return res.status(500).json({
                success: false,
                message: 'Invalid prediction returned by Python.'
            });
        }

        res.json({
            success: true,
            prediction: Number(prediction)
        });
    });
});

// Unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found.'
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log('================================');
    console.log('Heart Disease Prediction Server');
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available: ${fs.existsSync(INDEX_FILE)}`);
    console.log('================================');
});