const axios = require('axios')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoute = require('./routes/userRoute');
const topicRoute = require('./routes/topicRoute');
const postRoute = require('./routes/postRoute');
const connectToMongo = require('./db/connection')
const { scheduleEmails, createAndSendEmails } = require('./email')
require('dotenv').config({ path: '.env' });

const app = express();
const port = process.env.PORT;

connectToMongo();

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use('/api/user',userRoute);
app.use('/api/topic', topicRoute);
app.use('/api/post', postRoute);
app.get('/cron_custom', async (req, res)=>{
  try {
    await createAndSendEmails();
    res.send('Email send successfully');
  } catch (error) {
    console.log(error?.message);
    res.send('Some error occurred');
  }

})

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
