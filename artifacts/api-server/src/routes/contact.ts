import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { sendContactEmail } from "../services/emailService.js";

const router: IRouter = Router();

const ContactBody = z.object({
  type: z.enum(["request-access", "walkthrough"]),
  name: z.string().min(1, "Your name is required").max(160),
  email: z.string().email("A valid work email is required"),
  company: z.string().min(1, "Company is required").max(200),
  teamSize: z.string().max(80).optional(),
  preferredTime: z.string().max(200).optional(),
  message: z.string().max(4000).optional(),
});

/**
 * POST /api/contact — public (no auth). Emails a "Request access" or
 * "Book a walkthrough" submission from the marketing site to the team.
 */
router.post("/contact", async (req, res) => {
  const parsed = ContactBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" });
  }

  const d = parsed.data;
  const clean = (v?: string) => {
    const t = v?.trim();
    return t && t.length > 0 ? t : null;
  };

  try {
    await sendContactEmail({
      type: d.type,
      name: d.name.trim(),
      email: d.email.trim(),
      company: d.company.trim(),
      teamSize: clean(d.teamSize),
      preferredTime: clean(d.preferredTime),
      message: clean(d.message),
    });
  } catch (err) {
    req.log.error({ err }, "Contact email failed");
    return res
      .status(502)
      .json({ error: "We could not send your message just now. Please try again shortly." });
  }

  return res.status(201).json({ ok: true });
});

export default router;
