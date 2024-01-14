const {createAndSendEmails } = require("../email");

try {
  createAndSendEmails();
  console.log("Emails sent successfully");
} catch (error) {
  console.log("Some error occurred", error?.message);
}
