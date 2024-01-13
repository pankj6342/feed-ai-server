const fs = require("fs");
const axios = require("axios");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const Topic = require("./models/TopicSchema");
const { addPostToTopic } = require("./controller/topicController");
const {
  createPost,
  createAndAddPostToTopic,
} = require("./controller/postController");
const emailTemplate = fs.readFileSync("./emailTemplate.html", "utf8");

const production_api = process.env.production_api;
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTJlZWUyMjAtMWJkMy00MWMzLWE3ZjEtNTI1OThmNjNiZjg4IiwidHlwZSI6ImFwaV90b2tlbiJ9.MvdyCrNLRlCMq7rEGdEa9dxJpD2gDamY_RCmvORR4oY";
const dummy_api = process.env.dummy_api;
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZTJlZWUyMjAtMWJkMy00MWMzLWE3ZjEtNTI1OThmNjNiZjg4IiwidHlwZSI6InNhbmRib3hfYXBpX3Rva2VuIn0.WcEOEr1VkUGUSRRM8cCH6TOuCjDy0WdR1u1otpBRTiU";

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
      fallback_providers: "",
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
        user: "2pankajbhardwaj@gmail.com",
        pass: "jifi xxdm dbgn wxfj",
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
    const topics = await Topic.find({});
    // console.log({ topics });
  for (const topic of topics) {
    const title = topic.title;
    const { success, answer } = await generateAnswer(`Write a newsletter on ${title}`);
    // console.log({ answer });
    if (!success) continue;
    await createAndAddPostToTopic(`Newsletter on ${title}`, answer, topic._id);
    const subscribers = topic.subscribers;
    const emailSubject = title;
    sendEmailHelper(emailSubject, answer, subscribers);
  }
};

module.exports.scheduleEmails = () => {
  try {
    cron.schedule("* * * * *", () => createAndSendEmails());
  } catch (error) {
    console.log({ error });
  }
};

// module.exports = {scheduleEmails};
