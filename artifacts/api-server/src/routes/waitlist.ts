import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { db, waitlistTable } from "@workspace/db";
import { sendWaitlistNotification } from "../services/emailService.js";

const router: IRouter = Router();

const WaitlistBody = z.object({
  email: z.string().email("A valid email is required"),
  name: z.string().max(160).optional(),
  company: z.string().max(200).optional(),
  role: z.string().max(160).optional(),
});

/**
 * POST /api/waitlist — public (no auth). Stores a prospect on the launch
 * waitlist and fires a best-effort notification email to the team.
 */
router.post("/waitlist", async (req, res) => {
  const parsed = WaitlistBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid submission" });
  }

  const { email, name, company, role } = parsed.data;
  const clean = (v?: string) => {
    const t = v?.trim();
    return t && t.length > 0 ? t : null;
  };

  const [row] = await db
    .insert(waitlistTable)
    .values({
      email: email.toLowerCase().trim(),
      name: clean(name),
      company: clean(company),
      role: clean(role),
      source: "getbluemantis.com",
    })
    .returning();

  // Fire-and-forget — never block (or fail) the signup on email delivery.
  void sendWaitlistNotification({ email, name: clean(name), company: clean(company), role: clean(role) }).catch(
    (err) => req.log.warn({ err }, "Waitlist notification email failed"),
  );

  return res.status(201).json({ ok: true, id: row?.id });
});

export default router;
