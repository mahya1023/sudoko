const express = require('express');
const cors = require('cors');
const generateSudoku = require("./sudokuGender.js");
const app = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
    next();
});
const port = 5000;


app.get("/generate-sudoku", (req, res) => {
    const sudoku = generateSudoku();
    res.json(sudoku);
});
app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});