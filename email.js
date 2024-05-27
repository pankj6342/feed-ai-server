import axios from "axios"
import cron from "node-cron"
import nodemailer from "nodemailer"
import handlebars from "handlebars"
import Topic from "./models/TopicSchema.js"
import postController from "./controller/postController.js";
import emailTemplate from "./emailTemplate.js"
import dotenv from 'dotenv'

dotenv.config({ path: '.env' }); // Load environment variables

const production_api = process.env.production_api;
const dummy_api = process.env.dummy_api;

const generateAnswer = async (question) => {
  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/text/generation",
    headers: {
      authorization: `Bearer ${production_api}`,
    },
    data: {
      providers: "cohere",
      text: question,
      temperature: 0.2,
      max_tokens: 250,
      fallback_providers: "openai",
    },
  };
  try {
    const response = await axios.request(options);
    const answer = response?.data?.cohere?.generated_text || "";
    return {
      success: true,
      answer,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      answer,
    };
  }
};

const sendEmailHelper = (emailSubject, emailBody, subscribers) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    subscribers.forEach((subscriber) => {
      const templateData = {
        // Basic subscriber information
        name: subscriber.name,
        email: subscriber.email,

        articles: [
          {
            title: emailSubject,
            excerpt: emailBody,
            link: "https://example.com/article1",
          },

        ],
        unsubscribeLink: "https://example.com/unsubscribe/" + subscriber.id,
      };

      const htmlContent = handlebars.compile(emailTemplate)(templateData);

      const mailOptions = {
        from: "FeedAI <newsletter@feedai.com>",
        to: subscriber.email,
        subject: `${subscriber.name}'s Newsletter | ${emailSubject}`,
        html: htmlContent,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    });
  } catch (error) {
    console.log({ error });
  }
};

const createAndSendEmails = async () => {
  try {
    const topics = await Topic.find({});
    // console.log({ topics });
    for (const topic of topics) {
      const title = topic.title;
      // Delay execution for 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));
    
      const { success, answer } = await generateAnswer(`Write a newsletter on ${title}`);
      if (!success) continue;
    
      await postController.createAndAddPostToTopic(`Newsletter on ${title}`, answer, topic._id);
      const subscribers = topic.subscribers;
      const emailSubject = title;
      sendEmailHelper(emailSubject, answer, subscribers);
    }
    
  } catch (error) {
    console.log(error?.message);
    throw error;
  }
};

const scheduleEmails = () => {
  try {
    cron.schedule("* * * * *", () => createAndSendEmails());
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export {scheduleEmails, createAndSendEmails};
