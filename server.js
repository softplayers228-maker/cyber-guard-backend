require('dotenv').config();
const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Telegram API
app.post('/api/send-telegram', async (req, res) => {
  try {
    const { name, message } = req.body;
    const text = `New request from ${name}: ${message}`;

    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.CHAT_ID,
      text
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Telegram error');
  }
});

// Gmail API
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { name, message } = req.body;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Cyber Guard Request',
      text: `Name: ${name}\nMessage: ${message}`
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('Email error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));