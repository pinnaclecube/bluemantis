import { logger } from "../lib/logger.js";

/** Where new waitlist signups are emailed. */
const NOTIFY_TO = "arvind.kandula@devcare.com";

export interface WaitlistEntry {
  email: string;
  name?: string | null;
  company?: string | null;
  role?: string | null;
}

/**
 * Emails a notification to the team when someone joins the waitlist.
 * Uses the Resend HTTP API (no SMTP setup needed). No-ops with a warning if
 * RESEND_API_KEY is not configured, so the signup itself never fails on email.
 *
 * Env:
 *   RESEND_API_KEY      — Resend API key (required to actually send)
 *   WAITLIST_FROM_EMAIL — verified from address, e.g. "Blue Mantis <hello@getbluemantis.com>"
 */
export async function sendWaitlistNotification(entry: WaitlistEntry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.WAITLIST_FROM_EMAIL || "Blue Mantis <onboarding@resend.dev>";

  if (!apiKey) {
    logger.warn(
      { email: entry.email },
      "RESEND_API_KEY not set — waitlist signup stored but notification email skipped",
    );
    return;
  }

  const text = [
    "New Blue Mantis waitlist signup",
    "",
    `Email:   ${entry.email}`,
    entry.name ? `Name:    ${entry.name}` : null,
    entry.company ? `Company: ${entry.company}` : null,
    entry.role ? `Role:    ${entry.role}` : null,
    "",
    "— getbluemantis.com",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [NOTIFY_TO],
      reply_to: entry.email,
      subject: `New waitlist signup: ${entry.email}`,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${body}`);
  }
}
