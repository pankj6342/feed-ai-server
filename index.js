import express from 'express';
import cors from 'cors';
import userRoute from './routes/userRoute.js';
import topicRoute from './routes/topicRoute.js';
import postRoute from './routes/postRoute.js';
import connectToMongo from './db/connection.js';
import { scheduleEmails, createAndSendEmails } from './email.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // Load environment variables
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
