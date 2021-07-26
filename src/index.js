const express = require('express');
const { StatusCodes } = require('http-status-codes');
const config = require('./config');

const app = express();

process
.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection', reason.message);
    process.exit(1);
})
.on('uncaughtException', (err) => {
    console.error('Uncaught exception', err.message);
    process.exit(1);
});

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

app.use(require('./routes'));

app.use('*', (req, res) => {
    return res.status(StatusCodes.NOT_FOUND).json({ message: `Path not found ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
    return res.status(StatusCodes.NOT_FOUND).json({ message: err.message, code: 'SERVER_ERROR' });
});

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});
