const {createAndSendEmails } = require("../email");

exports.handler = async (event, context) => {
  // Your cron job logic here
  try {
    await createAndSendEmails();
    console.log("Emails sent successfully");
  } catch (error) {
    console.log("Some error occurred", error?.message);
  }
};
