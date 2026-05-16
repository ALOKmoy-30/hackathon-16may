require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/data', require('./src/routes/api'));
app.use('/api/telegram', require('./src/routes/telegram'));
app.use('/api/config', require('./src/routes/config'));
app.use('/api/auth', require('./src/routes/auth'));

app.use(require('./src/middleware/errorHandler'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
