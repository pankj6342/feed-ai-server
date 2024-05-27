import { createAndSendEmails } from "../email";

export default async function handler(req, res) {
  try {
    await createAndSendEmails();
    res.status(200).end("Cron Job Success!");
  } catch (error) {
    res.status(500).end("Cron Job Failed: " + error.message);
  }
}
