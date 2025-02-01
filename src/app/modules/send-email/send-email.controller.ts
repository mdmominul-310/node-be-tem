import { Request, Response, Router } from "express";
import smsEmailTransporter from "../../../helpers/smsEmailTransporter";

const sendEmail = async (req: Request, res: Response) => {
  const { sendEmail } = smsEmailTransporter;
  const result = await sendEmail({
    to: req.body.to,
    subject: req.body.subject,
    message: req.body.message,
  });
  res.json({ message: "Email sent successfully", result });
};

const router: Router = Router();

router.post("/", sendEmail);

export { router as sendEmailRouter };
