// Author: Tianzi Zhang
// GitHub: acse-tz2523
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const xlsx = require('xlsx');
const csv = require('csv-parser');

const app = express();
app.use(cors());

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory');
}

// Configure multer storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Use relative path here
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Handle file upload and processing
app.post('/upload', upload.single('file'), (req, res) => {
    console.log('Now in Upload path');
    const { scenario } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ status: 400, message: 'No file uploaded.' });
    }

    // Validate the uploaded file type
    const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    if (!validTypes.includes(file.mimetype)) {
        console.log('Validating file type');
        return res.status(400).json({ status: 400, message: 'Invalid file type. Only Excel or CSV files are allowed.' });
    }

    // Validate the scenario name
    const validScenarios = ['R_S1', 'R_S2', 'R_S3', 'R_S4', 'US1Gt', 'EUUSChina'];
    if (!validScenarios.includes(scenario)) {
        console.log('Validating scenario name');
        return res.status(400).json({ status: 400, message: 'Invalid scenario selected.' });
    }

    // Temporary file path
    const tempFilePath = file.path;

    // Define required column names
    const requiredColumns = ['Country', 'Growth', 'Storage', 'Rate', 'Global'];

    // Process Excel and CSV files
    try {
        let jsonData;

        if (file.mimetype.includes('sheet') || file.mimetype.includes('excel')) {
            console.log('Processing Excel file');
            // Process Excel file
            const workbook = xlsx.readFile(tempFilePath);
            const sheetName = workbook.SheetNames[0]; // Read the first sheet
            const sheet = workbook.Sheets[sheetName];
            jsonData = xlsx.utils.sheet_to_json(sheet, { defval: null });

        } else if (file.mimetype === 'text/csv') {
            // Process CSV file
            jsonData = [];
            fs.createReadStream(tempFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    jsonData.push(row);
                })
                .on('end', () => {
                    validateAndSaveData(jsonData);
                });
            return; // Return early to wait for CSV parsing to complete
        }

        // Validate and save data
        validateAndSaveData(jsonData);

    } catch (error) {
        console.error(`Error processing file: ${error}`);
        res.status(500).json({ status: 500, message: 'Failed to process the file.' });
    } finally {
        // Delete the temporary file
        fs.unlinkSync(tempFilePath);
    }

    // Validate the data and save it to a JSON file
    function validateAndSaveData(jsonData) {
        console.log('Validating file format');
        // Validate that the file has all required columns
        const fileColumns = Object.keys(jsonData[0]);
        const hasAllRequiredColumns = requiredColumns.every(col => fileColumns.includes(col));
        if (!hasAllRequiredColumns) {
            return res.status(400).json({ status: 400, message: 'Invalid file format. Required columns: Country, Growth, Storage, Rate, Global.' });
        }

        // Group data by country
        const groupedData = jsonData.reduce((acc, row) => {
            const country = row.Country;
            if (!acc[country]) {
                acc[country] = [];
            }
            // Remove the Country column
            const { Country, ...dataWithoutCountry } = row;
            acc[country].push(dataWithoutCountry);
            return acc;
        }, {});
        // Verify that each country has the same number of entries
        // const dataLengths = Object.values(groupedData).map(countryData => countryData.length);
        // const isDataConsistent = dataLengths.every(length => length === dataLengths[0]);
        // if (! isDataConsistent) {
        //     return res.status(400).json({ status: 400, message: 'Data inconsistency:  each country must have the same number of entries.' });
        //}

        // Target JSON file path
        const outputFilePath = path.join(__dirname, 'data', `${scenario}.json`);

        // Write JSON data to the file
        fs.writeFileSync(outputFilePath, JSON.stringify(groupedData, null, 4));
        res.status(200).json({ status: 200, message: `File uploaded and processed successfully. Data saved to ${scenario}.json.` });
    }
});

// Handle requests for aggregating sum of country target values
app.get('/data/aggregate/sum/:scenario', (req, res) => {
    const { scenario } = req.params;
    const filePath = path.join(__dirname, 'data', `${scenario}.json`);

    console.log("Now in the API for Image 2");

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(404).send('File not found');
            return;
        }

        const jsonData = JSON.parse(data);

        // Print the number of countries in the current JSON
        const countries = Object.keys(jsonData);
        console.log(`Number of countries: ${countries.length}`);

        // Initialize the total array, its length is determined by the number of entries in the first country
        const total = new Array(jsonData[countries[0]].length).fill(0);

        // Iterate through each country's data
        countries.forEach(country => {
            const countryData = jsonData[country];
            console.log(`Country: ${country}, Number of entries: ${countryData.length}`);

            countryData.forEach((entry, index) => {
                // Accumulate the Rate at each time point
                total[index] += entry.Rate || 0;
            });
        });

        res.json({ scenario, total });
    });
});

// Handle requests for specific country data in a scenario
app.get('/data/:scenario/:country', (req, res) => {
    const { scenario, country } = req.params;
    const filePath = path.join(__dirname, 'data', `${scenario}.json`);

    console.log(`Accessing data for country: ${country} in scenario: ${scenario}`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(404).send('File not found');
            return;
        }

        const jsonData = JSON.parse(data);
        res.json(jsonData[country] || 'Country data not found');
    });
});

// New API endpoint: Retrieve entire scenario data
app.get('/data/api/scenario/:scenario', (req, res) => {
    const { scenario } = req.params;
    const filePath = path.join(__dirname, 'data', `${scenario}.json`);

    console.log(`Accessing data for scenario: ${scenario}`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(404).send('File not found');
            return;
        }

        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
});

// New API endpoint: Filter data by range
app.get('/data/global/:scenario/:range', (req, res) => {
    const { scenario, range } = req.params;
    const [minRange, maxRange] = range.split('_').map(Number);
    const filePath = path.join(__dirname, 'data', `${scenario}.json`);
    console.log(filePath);
    console.log(range);

    console.log(`Accessing data for scenario: ${scenario} in range: ${minRange}-${maxRange}`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(404).send('File not found');
            return;
        }

        const jsonData = JSON.parse(data);
        const filteredData = {};

        for (const country in jsonData) {
            filteredData[country] = jsonData[country].filter(item => item.Global >= minRange && item.Global <= maxRange);
        }

        res.json(filteredData);
    });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Path to data directory:', path.join(__dirname, 'data'));
});
