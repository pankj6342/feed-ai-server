import { createAndSendEmails } from "../email";

const handler = async (req, res) => {
  try {
    await createAndSendEmails();
    res.status(200).end("Cron Job run Successfully");
  } catch (e) {
    res.status(500).end("Some error occured" + e.message);
  }
};
export default handler;
